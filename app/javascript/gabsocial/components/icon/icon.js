import CloseIcon from './svgs/close_icon'
import CommentIcon from './svgs/comment_icon'
import EllipsisIcon from './svgs/ellipsis_icon'
import GlobeIcon from './svgs/globe_icon'
import GroupIcon from './svgs/group_icon'
import HomeIcon from './svgs/home_icon'
import LikeIcon from './svgs/like_icon'
import NotificationsIcon from './svgs/notifications_icon'
import RepostIcon from './svgs/repost_icon'
import SearchIcon from './svgs/search_icon'
import ShareIcon from './svgs/share_icon'
import VerifiedIcon from './svgs/verified_icon'

export default class Icon extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
  }

  render() {
    const { id, ...options } = this.props

    console.log("id:", id)

    switch (id) {
      case 'close':
        return <CloseIcon {...options} />
      case 'comment':
        return <CommentIcon {...options} />
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
      case 'notifications':
        return <NotificationsIcon {...options} />
      case 'repost':
        return <RepostIcon {...options} />
      case 'search':
        return <SearchIcon {...options} />
        case 'share':
            return <ShareIcon {...options} />
      case 'verified':
        return <VerifiedIcon {...options} />

      default:
        return <NotificationsIcon {...options} />
    }

  }
}
