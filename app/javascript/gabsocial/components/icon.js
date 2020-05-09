import AddIcon from '../assets/add_icon'
import AngleRightIcon from '../assets/angle_right_icon'
import AppsIcon from '../assets/apps_icon'
import ArrowLeftIcon from '../assets/arrow_left_icon'
import ArrowRightIcon from '../assets/arrow_right_icon'
import AudioIcon from '../assets/audio_icon'
import AudioMuteIcon from '../assets/audio_mute_icon'
import BackIcon from '../assets/back_icon'
import BlockIcon from '../assets/block_icon'
import BlockquoteIcon from '../assets/blockquote_icon'
import BoldIcon from '../assets/bold_icon'
import CalendarIcon from '../assets/calendar_icon'
import ChatIcon from '../assets/chat_icon'
import CircleIcon from '../assets/circle_icon'
import CloseIcon from '../assets/close_icon'
import CodeIcon from '../assets/code_icon'
import CogIcon from '../assets/cog_icon'
import CommentIcon from '../assets/comment_icon'
import CopyIcon from '../assets/copy_icon'
import DissenterIcon from '../assets/dissenter_icon'
import EllipsisIcon from '../assets/ellipsis_icon'
import EmailIcon from '../assets/email_icon'
import ErrorIcon from '../assets/error_icon'
import ExploreIcon from '../assets/explore_icon'
import FullscreenIcon from '../assets/fullscreen_icon'
import GabLogoIcon from '../assets/gab_logo'
import GifIcon from '../assets/gif_icon'
import GlobeIcon from '../assets/globe_icon'
import GroupIcon from '../assets/group_icon'
import GroupAddIcon from '../assets/group_add_icon'
import HappyIcon from '../assets/happy_icon'
import HiddenIcon from '../assets/hidden_icon'
import HomeIcon from '../assets/home_icon'
import ItalicIcon from '../assets/italic_icon'
import LikeIcon from '../assets/like_icon'
import LikedIcon from '../assets/liked_icon'
import LinkIcon from '../assets/link_icon'
import ListIcon from '../assets/list_icon'
import ListAddIcon from '../assets/list_add_icon'
import LoadingIcon from '../assets/loading_icon'
import LockIcon from '../assets/lock_icon'
import LockFilledIcon from '../assets/lock_filled_icon'
import MediaIcon from '../assets/media_icon'
import MicIcon from '../assets/mic_icon'
import MinimizeFullscreenIcon from '../assets/minimize_fullscreen_icon'
import MissingIcon from '../assets/missing_icon'
import MoreIcon from '../assets/more_icon'
import NotificationsIcon from '../assets/notifications_icon'
import OLListIcon from '../assets/ol_list_icon'
import PauseIcon from '../assets/pause_icon'
import PencilIcon from '../assets/pencil_icon'
import PinIcon from '../assets/pin_icon'
import PlayIcon from '../assets/play_icon'
import PollIcon from '../assets/poll_icon'
import RepostIcon from '../assets/repost_icon'
import RichTextIcon from '../assets/rich_text_icon'
import SearchIcon from '../assets/search_icon'
import SearchAltIcon from '../assets/search_alt_icon'
import SelectIcon from '../assets/select_icon'
import ShareIcon from '../assets/share_icon'
import ShopIcon from '../assets/shop_icon'
import StrikethroughIcon from '../assets/strikethrough_icon'
import SubtractIcon from '../assets/subtract_icon'
import TextSizeIcon from '../assets/text_size_icon'
import TrashIcon from '../assets/trash_icon'
import TrendsIcon from '../assets/trends_icon'
import ULListIcon from '../assets/ul_list_icon'
import UnderlineIcon from '../assets/underline_icon'
import UnlockFilledIcon from '../assets/unlock_filled_icon'
import VerifiedIcon from '../assets/verified_icon'
import WarningIcon from '../assets/warning_icon'
import WebsiteIcon from '../assets/website_icon'

const ICONS = {
  'add': AddIcon,
  'angle-right': AngleRightIcon,
  'apps': AppsIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'audio': AudioIcon,
  'audio-mute': AudioMuteIcon,
  'back': BackIcon,
  'block': BlockIcon,
  'blockquote': BlockquoteIcon,
  'bold': BoldIcon,
  'calendar': CalendarIcon,
  'chat': ChatIcon,
  'close': CloseIcon,
  'code': CodeIcon,
  'cog': CogIcon,
  'comment': CommentIcon,
  'copy': CopyIcon,
  'dissenter': DissenterIcon,
  'ellipsis': EllipsisIcon,
  'email': EmailIcon,
  'error': ErrorIcon,
  'explore': ExploreIcon,
  'fullscreen': FullscreenIcon,
  'logo': GabLogoIcon,
  'gif': GifIcon,
  'globe': GlobeIcon,
  'group': GroupIcon,
  'group-add': GroupAddIcon,
  'hidden': HiddenIcon,
  'happy': HappyIcon,
  'home': HomeIcon,
  'italic': ItalicIcon,
  'like': LikeIcon,
  'liked': LikedIcon,
  'link': LinkIcon,
  'list': ListIcon,
  'list-add': ListAddIcon,
  'loading': LoadingIcon,
  'lock': LockIcon,
  'lock-filled': LockFilledIcon,
  'media': MediaIcon,
  'mic': MicIcon,
  'minimize-fullscreen': MinimizeFullscreenIcon,
  'missing': MissingIcon,
  'more': MoreIcon,
  'notifications': NotificationsIcon,
  'ol-list': OLListIcon,
  'pause': PauseIcon,
  'pencil': PencilIcon,
  'pin': PinIcon,
  'play': PlayIcon,
  'poll': PollIcon,
  'repost': RepostIcon,
  'rich-text': RichTextIcon,
  'search': SearchIcon,
  'search-alt': SearchAltIcon,
  'select': SelectIcon,
  'share': ShareIcon,
  'shop': ShopIcon,
  'strikethrough': StrikethroughIcon,
  'subtract': SubtractIcon,
  'text-size': TextSizeIcon,
  'trash': TrashIcon,
  'trends': TrendsIcon,
  'ul-list': ULListIcon,
  'underline': UnderlineIcon,
  'unlock-filled': UnlockFilledIcon,
  'verified': VerifiedIcon,
  'warning': WarningIcon,
  'website': WebsiteIcon,
  '': CircleIcon,
}

export default class Icon extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.string,
  }

  render() {
    const { id, size, className } = this.props

    // : todo : add all required icons
    const Asset = ICONS[id] || CircleIcon

    return <Asset size={size} className={className} />

  }

}
