import { defineMessages, injectIntl } from 'react-intl'
import { closePopover } from '../../actions/popover'
import { changeSetting, saveSettings } from '../../actions/settings'
import {
  COMMENT_SORTING_TYPE_NEWEST,
  COMMENT_SORTING_TYPE_OLDEST,
  COMMENT_SORTING_TYPE_TOP,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  oldest: { id: 'comment_sort.oldest', defaultMessage: 'Oldest' },
  newest: { id: 'comment_sort.newest', defaultMessage: 'Recent' },
  top: { id: 'comment_sort.top', defaultMessage: 'Most Liked' },
})

const mapDispatchToProps = (dispatch) => ({
  onSetCommentSortingSetting(type) {
    dispatch(changeSetting(['commentSorting'], type))
    dispatch(saveSettings())
    dispatch(closePopover())
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class CommentSortingOptionsPopover extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onSetCommentSortingSetting: PropTypes.func.isRequired,
    isXS: PropTypes.bool,
  }

  handleOnClick = (type) => {
    this.props.onSetCommentSortingSetting(type)
  }

  render() {
    const { intl, isXS } = this.props

    return (
      <PopoverLayout width={180} isXS={isXS}>
        <List
          size='large'
          scrollKey='comment_sorting_options'
          items={[
            {
              hideArrow: true,
              title: intl.formatMessage(messages.newest),
              onClick: () => this.handleOnClick(COMMENT_SORTING_TYPE_NEWEST),
            },
            {
              hideArrow: true,
              title: intl.formatMessage(messages.oldest),
              onClick: () => this.handleOnClick(COMMENT_SORTING_TYPE_OLDEST),
            },
            {
              hideArrow: true,
              title: intl.formatMessage(messages.top),
              onClick: () => this.handleOnClick(COMMENT_SORTING_TYPE_TOP),
            },
          ]}
          small
        />
      </PopoverLayout>
    )
  }
}