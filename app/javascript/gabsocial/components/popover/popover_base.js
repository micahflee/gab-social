import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Manager, Reference, Popper } from 'react-popper'
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
})

const mapDispatchToProps = (dispatch, { status, items }) => ({
  onOpen(id, onItemClick, popoverPlacement, keyboard) {
    // dispatch(isUserTouching() ? openModal('ACTIONS', {
    //   status,
    //   actions: items,
    //   onClick: onItemClick,
    // }) : openPopover(id, popoverPlacement, keyboard))
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
    title: PropTypes.string,
    disabled: PropTypes.bool,
    status: ImmutablePropTypes.map,
    isUserTouching: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    position: PropTypes.string,
    openPopoverType: PropTypes.number,
    visible: PropTypes.bool,
    targetRef: PropTypes.node,
    innerRef: PropTypes.node,
  }

  static defaultProps = {
    title: 'Menu',
    position: 'bottom',
  }

  state = {
    id: id++,
  }

  handleClose = () => {
    this.props.onClose(this.state.id)
  }

  handleKeyDown = e => {
    switch (e.key) {
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
    const {
      children,
      visible,
      position,
      openPopoverType,
      targetRef,
      innerRef,
    } = this.props
    const open = this.state.id === openPopoverType

    const containerClasses = cx({
      default: 1,
      z4: 1,
      displayNone: !visible,
    })

    console.log("targetRef:", targetRef)


    return (
      <Manager>
        <Popper
          placement={position}
          referenceElement={targetRef}
        >
          {({ ref, style, placement, arrowProps }) => (
            <div ref={ref} style={style} data-placement={placement} className={[_s.my5, _s.boxShadow2].join(' ')}>
              <div ref={arrowProps.ref} style={arrowProps.style} />
              <div ref={innerRef} data-popover='true' onKeyDown={this.handleKeyDown} className={containerClasses}>
                {children}
              </div>
            </div>
          )}
        </Popper>
      </Manager>
    )
  }

}
