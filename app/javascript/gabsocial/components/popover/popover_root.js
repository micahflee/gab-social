import detectPassiveEvents from 'detect-passive-events'
import { closePopover } from '../../actions/popover'
import Bundle from '../../features/ui/util/bundle'
import BundleModalError from '../bundle_modal_error'
import PopoverBase from './popover_base'
import ContentWarningPopover from './content_warning_popover'
import DatePickerPopover from './date_picker_popover'
import EmojiPickerPopover from './emoji_picker_popover'
import GroupInfoPopover from './group_info_popover'
import ProfileOptionsPopover from './profile_options_popover'
import SearchPopover from './search_popover'
import SidebarMorePopover from './sidebar_more_popover'
import StatusOptionsPopover from './status_options_popover'
import StatusSharePopover from './status_share_popover'
import StatusVisibilityPopover from './status_visibility_popover'
import UserInfoPopover from './user_info_popover'

const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false

const POPOVER_COMPONENTS = {
  CONTENT_WARNING: () => Promise.resolve({ default: ContentWarningPopover }),
  DATE_PICKER: () => Promise.resolve({ default: DatePickerPopover }),
  EMOJI_PICKER: () => Promise.resolve({ default: EmojiPickerPopover }),
  GROUP_INFO: () => GroupInfoPopover,
  PROFILE_OPTIONS: () => Promise.resolve({ default: ProfileOptionsPopover }),
  SEARCH: () => Promise.resolve({ default: SearchPopover }),
  SIDEBAR_MORE: () => Promise.resolve({ default: SidebarMorePopover }),
  STATUS_OPTIONS: () => Promise.resolve({ default: StatusOptionsPopover }),
  STATUS_SHARE: () => Promise.resolve({ default: StatusSharePopover }),
  STATUS_VISIBILITY: () => Promise.resolve({ default: StatusVisibilityPopover }),
  USER_INFO: () => Promise.resolve({ default: UserInfoPopover }),
}

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

  setRef = c => {
    this.node = c
  }

  setFocusRef = c => {
    this.focusedItem = c
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
    const {
      type,
      props,
    } = this.props
    const visible = !!type

    console.log("POPOVER_COMPONENTS[type]:", type, POPOVER_COMPONENTS[type]);

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
            loading={this.renderLoading(type)}
            error={this.renderError}
            renderDelay={200}
          >
            {
              (SpecificComponent) => <SpecificComponent {...props} />
            }
          </Bundle>
        }
      </PopoverBase>
    )
  }

}