import { injectIntl, defineMessages } from 'react-intl'
// import { fetchTrends } from '../../actions/trends'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import TrendingItem from '../trends_panel_item'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  title: { id:'trends.title', defaultMessage: 'Trending right now' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
})

// const mapStateToProps = state => ({
//   trends: state.getIn(['trends', 'items']),
// })

// const mapDispatchToProps = dispatch => {
//   return {
//     fetchTrends: () => dispatch(fetchTrends()),
//   }
// }

export default
// @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class TrendsPanel extends ImmutablePureComponent {

  static propTypes = {
    trends: ImmutablePropTypes.list.isRequired,
    // fetchTrends: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount () {
    // this.props.fetchTrends()
  }

  render() {
    const { intl, trends } = this.props

    // !!! TESTING !!!
    // if (trends.isEmpty()) {
    //   return null
    // }

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        footerButtonTitle={intl.formatMessage(messages.show_all)}
        footerButtonTo='/explore'
      >
        <div className={_s.default}>
          { /* trends && trends.map(hashtag => (
            <TrendingItem key={hashtag.get('name')} hashtag={hashtag} />
          )) */ }
          <TrendingItem index='1' />
          <TrendingItem index='2' />
          <TrendingItem index='3' />
          <TrendingItem index='4' />
        </div>
      </PanelLayout>
    )
  }
}