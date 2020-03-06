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
      case 'angle-right':
        return <I.AngleRightIcon {...options} />
      case 'apps':
        return <I.AppsIcon {...options} />
      case 'audio':
        return <I.AudioIcon {...options} />
      case 'audio-mute':
        return <I.AudioMuteIcon {...options} />
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
      case 'error':
        return <I.ErrorIcon {...options} />
      case 'fullscreen':
        return <I.FullscreenIcon {...options} />
      case 'globe':
        return <I.GlobeIcon {...options} />
      case 'group':
        return <I.GroupIcon {...options} />
      case 'home':
        return <I.HomeIcon {...options} />
      case 'like':
        return <I.LikeIcon {...options} />
      case 'link':
        return <I.LinkIcon {...options} />
      case 'list':
        return <I.ListIcon {...options} />
      case 'loading':
        return <I.LoadingIcon {...options} />
      case 'media':
        return <I.MediaIcon {...options} />
      case 'minimize-fullscreen':
        return <I.MinimizeFullscreenIcon {...options} />
      case 'missing':
        return <I.MissingIcon {...options} />
      case 'more':
        return <I.MoreIcon {...options} />
      case 'notifications':
        return <I.NotificationsIcon {...options} />
      case 'pause':
        return <I.PauseIcon {...options} />
      case 'pin':
        return <I.PinIcon {...options} />
      case 'play':
        return <I.PlayIcon {...options} />
      case 'poll':
        return <I.PollIcon {...options} />
      case 'repost':
        return <I.RepostIcon {...options} />
      case 'search':
        return <I.SearchIcon {...options} />
      case 'search-alt':
        return <I.SearchAltIcon {...options} />
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
