import AddIcon from './svgs/add_icon'
import AppsIcon from './svgs/apps_icon'
import AngleRightIcon from './svgs/angle_right_icon'
import BackIcon from './svgs/back_icon'
import CalendarIcon from './svgs/calendar_icon'
import ChatIcon from './svgs/chat_icon'
import CloseIcon from './svgs/close_icon'
import CommentIcon from './svgs/comment_icon'
import DissenterIcon from './svgs/dissenter_icon'
import EllipsisIcon from './svgs/ellipsis_icon'
import GlobeIcon from './svgs/globe_icon'
import GroupIcon from './svgs/group_icon'
import HomeIcon from './svgs/home_icon'
import LikeIcon from './svgs/like_icon'
import ListIcon from './svgs/list_icon'
import LoadingIcon from './svgs/loading_icon'
import MediaIcon from './svgs/media_icon'
import MoreIcon from './svgs/more_icon'
import NotificationsIcon from './svgs/notifications_icon'
import PollIcon from './svgs/poll_icon'
import RepostIcon from './svgs/repost_icon'
import SearchIcon from './svgs/search_icon'
import ShareIcon from './svgs/share_icon'
import ShopIcon from './svgs/shop_icon'
import SubtractIcon from './svgs/subtract_icon'
import TrendsIcon from './svgs/trends_icon'
import VerifiedIcon from './svgs/verified_icon'
import WarningIcon from './svgs/warning_icon'

export default class Icon extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
  }

  render() {
    const { id, ...options } = this.props

    switch (id) {
      case 'add':
        return <AddIcon {...options} />
      case 'apps':
        return <AppsIcon {...options} />
      case 'angle-right':
        return <AngleRightIcon {...options} />
      case 'back':
        return <BackIcon {...options} />
      case 'calendar':
        return <CalendarIcon {...options} />
      case 'chat':
        return <ChatIcon {...options} />
      case 'close':
        return <CloseIcon {...options} />
      case 'comment':
        return <CommentIcon {...options} />
      case 'dissenter':
        return <DissenterIcon {...options} />
      case 'ellipsis':
        return <EllipsisIcon {...options} />
      case 'globe':
        return <GlobeIcon {...options} />
      case 'group':
        return <GroupIcon {...options} />
      case 'home':
        return <HomeIcon {...options} />
      case 'like':
        return <LikeIcon {...options} />
      case 'list':
        return <ListIcon {...options} />
      case 'loading':
        return <LoadingIcon {...options} />
      case 'more':
        return <MoreIcon {...options} />
      case 'media':
        return <MediaIcon {...options} />
      case 'notifications':
        return <NotificationsIcon {...options} />
      case 'poll':
        return <PollIcon {...options} />
      case 'repost':
        return <RepostIcon {...options} />
      case 'search':
        return <SearchIcon {...options} />
      case 'share':
        return <ShareIcon {...options} />
      case 'shop':
        return <ShopIcon {...options} />
      case 'subtract':
        return <SubtractIcon {...options} />
      case 'trends':
        return <TrendsIcon {...options} />
      case 'verified':
        return <VerifiedIcon {...options} />
      case 'warning':
        return <WarningIcon {...options} />
      default:
        return <NotificationsIcon {...options} />
    }

  }
}
