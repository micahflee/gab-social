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

export default
@connect(mapStateToProps)
class PopoverRoot extends PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
  }

  renderEmpty = () => {
    return <div />
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
            loading={this.renderEmpty}
            error={this.renderEmpty}
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