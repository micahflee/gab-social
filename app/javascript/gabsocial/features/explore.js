import { withRouter } from 'react-router-dom'
import isObject from 'lodash.isobject'
import queryString from 'query-string'
import { fetchGabTrends } from '../actions/gab_trends'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Block from '../components/block'
import Heading from '../components/heading'
import Text from '../components/text'
import TrendsItem from '../components/trends_item'
import TabBar from '../components/tab_bar'
import Pills from '../components/pills'
import ColumnIndicator from '../components/column_indicator'
import Responsive from './ui/util/responsive_component';

// const messages = defineMessages({
//   title: { id: 'trends.title', defaultMessage: 'Trending right now' },
// })

const mapStateToProps = (state) => ({
  isError: state.getIn(['gab_trends', 'partner', 'isError']),
  isLoading: state.getIn(['gab_trends', 'partner', 'isLoading']),
  items: state.getIn(['gab_trends', 'partner', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onfetchGabTrends: () => dispatch(fetchGabTrends('partner')),
})

export default
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class Explore extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    items: PropTypes.object,
    onfetchGabTrends: PropTypes.func.isRequired,
  }

  state = {
    activeDomain: null,
  }

  updateOnProps = [
    'items',
    'isLoading',
    'isError',
  ]

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setActiveDomain(this.props.location)
    }
  }

  componentDidMount() {
    this.props.onfetchGabTrends()
    this.setActiveDomain(this.props.location)
  }

  setActiveDomain(location) {
    const { search } = location
    const qp = queryString.parse(search)
    const domain = qp.domain ? `${qp.domain}`.toLowerCase() : undefined

    console.log("domain: ", qp, domain)

    if (!!domain) {
      this.setState({ activeDomain: domain })
    } else {
      this.setState({ activeDomain: null })
    }
  }

  render () {
    const {
      intl,
      isError,
      isLoading,
      items,
    } = this.props
    const { activeDomain } = this.state

    console.log("activeDomain:", activeDomain)
    console.log("items:", items)

    if (isError || !isObject(items)) {
      return <div>error</div>
    }

    let domainExists = !activeDomain
    let headline, headlineLink
    let todaysTopTitle
    let leadHeadlines = []
    let todaysTop = []
    let domainTabs = []
    try {
      console.log("items.headline:", items.headline)

      headline = items.headline.title
      headlineLink = items.headline.href
      leadHeadlines = items.leadHeadlines

      if (activeDomain) {
        const domainBlock = items.trackedDomains.find((d) => `${d.domain}`.toLowerCase() === activeDomain)
        if (domainBlock) domainExists = true
        
        todaysTop = domainBlock.topUrls
        todaysTopTitle = domainBlock.title
      } else {
        todaysTop = items.trending.topUrls
        todaysTopTitle = "Today's Top"
      }

      const domains = items.trackedDomains
      domainTabs = domains.map((block) => ({
        title: block.title,
        to: `/explore?domain=${block.domain}`,
        onClick: () => {},
        active: activeDomain === `${block.domain}`.toLowerCase(),
      }))
      domainTabs = [
        {
          title: "Today's Top",
          to: `/explore`,
          onClick: () => {},
          active: !activeDomain,
        },
        ...domainTabs,
      ]
    } catch (error) {
      return (
        <div className={[_s.default, _s.width100PC].join(' ')}>
          <Block>
            <ColumnIndicator type='loading' />
          </Block>
        </div>
      )
    }

    if (!domainExists) {
      return <div>error</div>
    }

    console.log("domainTabs:", domainTabs)
    
    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        <Block>
          <div className={[_s.default, _s.width100PC, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <TabBar tabs={domainTabs} />
            </Responsive>
            <Responsive max={BREAKPOINT_EXTRA_SMALL}>
              <div className={[_s.default, _s.width100PC, _s.pt10, _s.pb5].join(' ')}>
                <Pills pills={domainTabs} />
              </div>
            </Responsive>
          </div>

          <div className={[_s.default, _s.px15, _s.py15].join(' ')}>
            <div className={[_s.default].join(' ')}>
              { 
                !activeDomain &&
                leadHeadlines.map((lead) => (
                  <div className={[_s.default].join(' ')}>
                    <Text size='small'>
                      {lead.title}
                    </Text>
                  </div>
                ))
              }
            </div>
            
            {
              !activeDomain &&
              <div className={[_s.default, _s.py15, _s.mt15, _s.mb15].join(' ')}>
                <Heading size='h1'>
                  <a href={headlineLink} className={[_s.noUnderline, _s.colorPrimary].join(' ')}>
                    {headline}
                  </a>
                </Heading>
              </div>
            }

            <div>
              <div className={[_s.default, _s.px15, _s.py10, _s.bgSubtle, _s.justifyContentCenter].join(' ')}>
                <Heading size='h2'>
                  {todaysTopTitle}
                </Heading>
              </div>
              <div className={[_s.default, _s.py10].join(' ')}>
                {
                  todaysTop.map((block, i) => (
                    <TrendsItem
                      key={`explore-trending-item-${i}`}
                      index={i + 1}
                      title={block.pagePreview.title}
                      author={block.domain.domain}
                      description={block.pagePreview.description}
                      url={block.pagePreview.url}
                      date={block.created}
                    />
                  ))
                }
              </div>
            </div>

          </div>
        </Block>
      </div>
    )
  }

}
