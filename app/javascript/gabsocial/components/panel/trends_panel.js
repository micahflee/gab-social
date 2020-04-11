import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchGabTrends } from '../../actions/gab_trends'
import PanelLayout from './panel_layout'
import ColumnIndicator from '../column_indicator'
import TrendingItem from '../trends_item'

const messages = defineMessages({
  title: { id: 'trends.title', defaultMessage: 'Trending right now' },
})

const mapStateToProps = (state) => ({
  gabtrends: state.getIn(['gab_trends', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchGabTrends: () => dispatch(fetchGabTrends()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class TrendsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    gabtrends: ImmutablePropTypes.list.isRequired,
    onFetchGabTrends: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.onFetchGabTrends()
  }

  render() {
    const { intl, gabtrends } = this.props

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
      >
        <div className={_s.default}>
          {
            gabtrends.isEmpty() &&
            <ColumnIndicator type='loading' />
          }
          {
            gabtrends && gabtrends.slice(0, 8).map((trend, i) => (
              <TrendingItem
                key={`gab-trend-${i}`}
                index={i + 1}
                isLast={i === 7}
                url={trend.get('url')}
                title={trend.get('title')}
                description={trend.get('description')}
                imageUrl={trend.get('image')}
                publishDate={trend.get('date_published')}
                author={trend.getIn(['author', 'name'], '')}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}