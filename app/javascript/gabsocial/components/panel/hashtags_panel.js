import { injectIntl, defineMessages } from 'react-intl'
import { fetchHashtags } from '../../actions/hashtags'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PanelLayout from './panel_layout'
import HashtagItem from '../hashtag_item'
import Button from '../button'

const messages = defineMessages({
  title: { id: 'hashtags.title', defaultMessage: 'Popular Hashtags' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
})

const mapStateToProps = state => ({
  hashtags: state.getIn(['hashtags', 'items']),
})

const mapDispatchToProps = dispatch => {
  return {
    fetchHashtags: () => dispatch(fetchHashtags()),
  }
}

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class HashtagsPanel extends ImmutablePureComponent {

  static propTypes = {
    hashtags: ImmutablePropTypes.list.isRequired,
    fetchHashtags: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.fetchHashtags()
  }

  render() {
    const { intl, hashtags } = this.props

    // !!! TESTING !!!
    // if (hashtags.isEmpty()) {
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
          { /* hashtags && hashtags.map(hashtag => (
            <HashtagingItem key={hashtag.get('name')} hashtag={hashtag} />
          )) */ }
          <HashtagItem />
          <HashtagItem />
          <HashtagItem />
          <HashtagItem />
          <HashtagItem />
        </div>
      </PanelLayout>
    )
  }
}