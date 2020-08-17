import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchGabTrends } from '../../actions/gab_trends'
import PanelLayout from './panel_layout'
import ScrollableList from '../scrollable_list'
import TrendsItem from '../trends_item'
import TrendsItemPlaceholder from '../placeholder/trends_item_placeholder'

const messages = defineMessages({
  title: { id: 'trends.title', defaultMessage: 'Trending right now' },
  readMore: { id: 'status.read_more', defaultMessage: 'Read more' },
})

const mapStateToProps = (state) => ({
  isError: state.getIn(['gab_trends', 'feed', 'isError']),
  isLoading: state.getIn(['gab_trends', 'feed', 'isLoading']),
  items: state.getIn(['gab_trends', 'feed', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onfetchGabTrends: () => dispatch(fetchGabTrends('feed')),
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class TrendsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isError: PropTypes.bool,
    isLazy: PropTypes.bool,
    isLoading: PropTypes.bool,
    items: ImmutablePropTypes.list.isRequired,
    onfetchGabTrends: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'items',
    'isLazy',
    'isLoading',
    'isError',
  ]

  state = {
    fetched: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.onfetchGabTrends()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.onfetchGabTrends()
      this.setState({ fetched: true })
    }
  }

  render() {
    const {
      intl,
      isError,
      isLoading,
      items,
    } = this.props
    const { fetched } = this.state
    
    const count = !!items ? items.count() : 0
    if (isError || (count === 0 && fetched)) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.readMore)}
        headerButtonTo='/news'
        footerButtonTitle={intl.formatMessage(messages.readMore)}
        footerButtonTo='/news'
      >
        <ScrollableList
          showLoading={isLoading}
          placeholderComponent={TrendsItemPlaceholder}
          placeholderCount={8}
          scrollKey='trending-items'
        >
          {
            items.slice(0, 8).map((trend, i) => (
              <TrendsItem
                key={`gab-trend-${i}`}
                index={i + 1}
                isLast={i === 7}
                title={trend.get('title')}
                description={trend.get('description')}
                url={trend.get('url')}
                author={trend.getIn(['author', 'name'], '')}
                date={trend.get('date_published')}
              />
            ))
          }
        </ScrollableList>
      </PanelLayout>
    )
  }
}