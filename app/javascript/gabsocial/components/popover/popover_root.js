import detectPassiveEvents from 'detect-passive-events'
import { closePopover } from '../../actions/popover'
import {
  POPOVER_CONTENT_WARNING,
  POPOVER_DATE_PICKER,
  POPOVER_EMOJI_PICKER,
  POPOVER_GROUP_INFO,
  POPOVER_PROFILE_OPTIONS,
  POPOVER_REPOST_OPTIONS,
  POPOVER_SEARCH,
  POPOVER_SIDEBAR_MORE,
  POPOVER_STATUS_OPTIONS,
  POPOVER_STATUS_SHARE,
  POPOVER_STATUS_VISIBILITY,
  POPOVER_USER_INFO,
} from '../../constants'
import {
  ContentWarningPopover,
  DatePickerPopover,
  EmojiPickerPopover,
  GroupInfoPopover,
  ProfileOptionsPopover,
  RepostOptionsPopover,
  SearchPopover,
  SidebarMorePopover,
  StatusOptionsPopover,
  StatusSharePopover,
  StatusVisibilityPopover,
  UserInfoPopover,
} from '../../features/ui/util/async_components'
import Bundle from '../../features/ui/util/bundle'
import PopoverBase from './popover_base'

const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false

const POPOVER_COMPONENTS = {}
POPOVER_COMPONENTS[POPOVER_CONTENT_WARNING] = ContentWarningPopover
POPOVER_COMPONENTS[POPOVER_DATE_PICKER] = DatePickerPopover
POPOVER_COMPONENTS[POPOVER_EMOJI_PICKER] = EmojiPickerPopover
POPOVER_COMPONENTS[POPOVER_GROUP_INFO] = GroupInfoPopover
POPOVER_COMPONENTS[POPOVER_PROFILE_OPTIONS] = ProfileOptionsPopover
POPOVER_COMPONENTS[POPOVER_REPOST_OPTIONS] = RepostOptionsPopover
POPOVER_COMPONENTS[POPOVER_SEARCH] = SearchPopover
POPOVER_COMPONENTS[POPOVER_SIDEBAR_MORE] = SidebarMorePopover
POPOVER_COMPONENTS[POPOVER_STATUS_OPTIONS] = StatusOptionsPopover
POPOVER_COMPONENTS[POPOVER_STATUS_SHARE] = StatusSharePopover
POPOVER_COMPONENTS[POPOVER_STATUS_VISIBILITY] = StatusVisibilityPopover
POPOVER_COMPONENTS[POPOVER_USER_INFO] = UserInfoPopover

const mapStateToProps = (state) => ({
  type: state.getIn(['popover', 'popoverType']),
  props: state.getIn(['popover', 'popoverProps'], {}),
})

const mapDispatchToProps = (dispatch) => ({
  onClose(optionalType) {
    dispatch(closePopover(optionalType))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class PopoverRoot extends PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  // getSnapshotBeforeUpdate() {
  //   return { visible: !!this.props.type }
  // }

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    onClose: PropTypes.func.isRequired,
  }

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('keydown', this.handleKeyDown, false)
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('keydown', this.handleKeyDown, false)
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions)
  }

  setRef = (c) => {
    this.node = c
  }

  handleKeyDown = e => {
    const items = Array.from(this.node.getElementsByTagName('a'))
    const index = items.indexOf(document.activeElement)
    let element

    switch (e.key) {
    case 'ArrowDown':
      element = items[index + 1]
      if (element) element.focus()
      break
    case 'ArrowUp':
      element = items[index - 1]
      if (element) element.focus()
      break
    case 'Home':
      element = items[0]
      if (element) element.focus()
      break
    case 'End':
      element = items[items.length - 1]
      if (element) element.focus()
      break
    }
  }

  handleItemKeyDown = e => {
    if (e.key === 'Enter') {
      this.handleClick(e)
    }
  }

  handleClick = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'))
    const { action, to } = this.props.items[i]

    this.props.onClose()

    if (typeof action === 'function') {
      e.preventDefault()
      action(e)
    } else if (to) {
      e.preventDefault()
      this.context.router.history.push(to)
    }
  }

  renderError = () => {
    return null
  }

  renderLoading = () => {
    return null
  }

  render() {
    const { type, props } = this.props
    const visible = !!type

    return (
      <PopoverBase
        visible={visible}
        innerRef={this.setRef}
        {...props}
      >
        {
          visible &&
          <Bundle
            fetchComponent={POPOVER_COMPONENTS[type]}
            loading={this.renderLoading()}
            error={this.renderError}
            renderDelay={200}
          >
            {
              (Component) => <Component {...props} />
            }
          </Bundle>
        }
      </PopoverBase>
    )
  }

}