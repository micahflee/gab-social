import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import { closePopover } from '../../actions/popover'
import { setGroupTimelineSort } from '../../actions/groups'
import {
  GROUP_TIMELINE_SORTING_TYPE_NEWEST,
  GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY,
  GROUP_TIMELINE_SORTING_TYPE_TOP,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  topTitle: { id: 'group_timeline_sorting.top_title', defaultMessage: 'Top Posts' },
  topSubtitle: { id: 'group_timeline_sorting.top_subtitle', defaultMessage: 'See gabs with most comments, likes and reposts first' },
  recentTitle: { id: 'group_timeline_sorting.recent_title', defaultMessage: 'Recent Activity' },
  recentSubtitle: { id: 'group_timeline_sorting.recent_subtitle', defaultMessage: 'See gabs with most recent comments first' },
  newTitle: { id: 'group_timeline_sorting.new_title', defaultMessage: 'New Posts' },
  newSubtitle: { id: 'group_timeline_sorting.new_subtitle', defaultMessage: 'See most recent gabs first' },
})

const mapStateToProps = (state) => ({
  sorting: state.getIn(['group_lists', 'sortByValue']),
})

const mapDispatchToProps = (dispatch) => ({
  onSort(sort) {
    dispatch(setGroupTimelineSort(sort))
    dispatch(closePopover())
  },
  onClosePopover: () => dispatch(closePopover()),
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupTimelineSortOptionsPopover extends PureComponent {

  static propTypes = {
    sorting: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    isXS: PropTypes.bool,
    onClosePopover: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
  }

  handleOnClick = (type) => {
    this.props.onSort(type)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      sorting,
      intl,
      isXS,
      options,
    } = this.props
    
    const isFeaturedTimeline = isObject(options) && options.collectionType === 'featured'

    const items = [
      {
        hideArrow: true,
        isActive: sorting === GROUP_TIMELINE_SORTING_TYPE_TOP,
        title: intl.formatMessage(messages.topTitle),
        subtitle: intl.formatMessage(messages.topSubtitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_TOP),
      }
    ]

    if (!isFeaturedTimeline) {
      items.push({
        hideArrow: true,
        isActive: sorting === GROUP_TIMELINE_SORTING_TYPE_NEWEST,
        title: intl.formatMessage(messages.newTitle),
        subtitle: intl.formatMessage(messages.newSubtitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_NEWEST),
      })
      items.push({
        hideArrow: true,
        isActive: sorting === GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY,
        title: intl.formatMessage(messages.recentTitle),
        subtitle: intl.formatMessage(messages.recentSubtitle),
        onClick: () => this.handleOnClick(GROUP_TIMELINE_SORTING_TYPE_RECENT_ACTIVITY),
      })
    }

    return (
      <PopoverLayout
        width={280}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          size={isXS ? 'large' : 'small'}
          scrollKey='group_timeline_sorting_options'
          items={items}
        />
      </PopoverLayout>
    )
  }
}