import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchGabTrends } from '../../actions/gab_trends'
import PanelLayout from './panel_layout'
import ScrollableList from '../scrollable_list'
import TrendsItem from '../trends_item'

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

  updateOnProps = [
    'gabtrends',
  ]

  componentDidMount() {
    this.props.onFetchGabTrends()
  }

  render() {
    const { intl, gabtrends } = this.props

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
      >
        <ScrollableList
          showLoading={gabtrends.size == 0}
          scrollKey='trending-items'
        >
          {
            gabtrends.slice(0, 8).map((trend, i) => (
              <TrendsItem
                key={`gab-trend-${i}`}
                index={i + 1}
                isLast={i === 7}
                trend={trend}
              />
            ))
          }
        </ScrollableList>
      </PanelLayout>
    )
  }
}