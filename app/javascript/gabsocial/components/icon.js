import * as I from '../assets'

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
        return <I.AddIcon {...options} />
      case 'apps':
        return <I.AppsIcon {...options} />
      case 'angle-right':
        return <I.AngleRightIcon {...options} />
      case 'back':
        return <I.BackIcon {...options} />
      case 'calendar':
        return <I.CalendarIcon {...options} />
      case 'chat':
        return <I.ChatIcon {...options} />
      case 'close':
        return <I.CloseIcon {...options} />
      case 'comment':
        return <I.CommentIcon {...options} />
      case 'dissenter':
        return <I.DissenterIcon {...options} />
      case 'ellipsis':
        return <I.EllipsisIcon {...options} />
      case 'globe':
        return <I.GlobeIcon {...options} />
      case 'group':
        return <I.GroupIcon {...options} />
      case 'home':
        return <I.HomeIcon {...options} />
      case 'like':
        return <I.LikeIcon {...options} />
      case 'list':
        return <I.ListIcon {...options} />
      case 'loading':
        return <I.LoadingIcon {...options} />
      case 'more':
        return <I.MoreIcon {...options} />
      case 'media':
        return <I.MediaIcon {...options} />
      case 'notifications':
        return <I.NotificationsIcon {...options} />
      case 'poll':
        return <I.PollIcon {...options} />
      case 'repost':
        return <I.RepostIcon {...options} />
      case 'search':
        return <I.SearchIcon {...options} />
      case 'share':
        return <I.ShareIcon {...options} />
      case 'shop':
        return <I.ShopIcon {...options} />
      case 'subtract':
        return <I.SubtractIcon {...options} />
      case 'trends':
        return <I.TrendsIcon {...options} />
      case 'verified':
        return <I.VerifiedIcon {...options} />
      case 'warning':
        return <I.WarningIcon {...options} />
      default:
        return <I.CircleIcon {...options} />
    }

  }
}
