import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classnames from 'classnames/bind'
import Overlay from 'react-overlays/lib/Overlay'
import spring from 'react-motion/lib/spring'
import Motion from '../../features/ui/util/optional_motion'
import { openPopover, closePopover } from '../../actions/popover'
import { openModal, closeModal } from '../../actions/modal'
import { isUserTouching } from '../../utils/is_mobile'

const cx = classnames.bind(_s)

let id = 0

const mapStateToProps = state => ({
  isModalOpen: state.get('modal').modalType === 'ACTIONS',
  popoverPlacement: state.getIn(['popover', 'placement']),
  openPopoverType: state.getIn(['popover', 'popoverType']),
  openedViaKeyboard: state.getIn(['popover', 'keyboard']),
})

const mapDispatchToProps = (dispatch, { status, items }) => ({
  onOpen(id, onItemClick, popoverPlacement, keyboard) {
    dispatch(isUserTouching() ? openModal('ACTIONS', {
      status,
      actions: items,
      onClick: onItemClick,
    }) : openPopover(id, popoverPlacement, keyboard))
  },
  onClose(id) {
    dispatch(closeModal())
    dispatch(closePopover(id))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class PopoverBase extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    icon: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    size: PropTypes.number.isRequired,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    status: ImmutablePropTypes.map,
    isUserTouching: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    popoverPlacement: PropTypes.string,
    openPopoverType: PropTypes.number,
    openedViaKeyboard: PropTypes.bool,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    title: 'Menu',
  }

  state = {
    id: id++,
  }

  handleClick = ({ target, type }) => {
    if (this.state.id === this.props.openPopoverType) {
      this.handleClose()
    } else {
      const { top } = target.getBoundingClientRect()
      const placement = top * 2 < innerHeight ? 'bottom' : 'top'

      this.props.onOpen(this.state.id, this.handleItemClick, placement, type !== 'click')
    }
  }

  handleClose = () => {
    this.props.onClose(this.state.id)
  }

  handleKeyDown = e => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        this.handleClick(e)
        e.preventDefault()
        break
      case 'Escape':
        this.handleClose()
        break
    }
  }

  handleItemClick = e => {
    const i = Number(e.currentTarget.getAttribute('data-index'))
    const { action, to } = this.props.items[i]

    this.handleClose()

    if (typeof action === 'function') {
      e.preventDefault()
      action()
    } else if (to) {
      e.preventDefault()
      this.context.router.history.push(to)
    }
  }

  setTargetRef = c => {
    this.target = c
  }

  findTarget = () => {
    return this.target
  }

  componentWillUnmount = () => {
    if (this.state.id === this.props.openPopoverType) {
      this.handleClose()
    }
  }

  render() {
    const { icon, children, visible, items, size, title, disabled, popoverPlacement, openPopoverType, openedViaKeyboard } = this.props
    const open = this.state.id === openPopoverType

    const containerClasses = cx({
      default: 1,
      z4: 1,
      displayNone: !visible,
    })

    return (
      <div onKeyDown={this.handleKeyDown} className={containerClasses}>
        { /* <div show={open} placement={popoverPlacement} target={this.findTarget}>
          <PopoverMenu items={items} onClose={this.handleClose} openedViaKeyboard={openedViaKeyboard} />
          {children}
        </div> */}
      </div>
    )
  }

}
