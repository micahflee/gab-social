import { Fragment } from 'react'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'
import classNames from 'classnames/bind'
import { openModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
})

const mapStateToProps = state => ({
  composeId: state.getIn(['compose', 'id']),
  composeText: state.getIn(['compose', 'text']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenModal(type, opts) {
    dispatch(openModal(type, opts))
  },
  onCancelReplyCompose() {
    dispatch(cancelReplyCompose())
  },
})

const cx = classNames.bind(_s)

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ModalBase extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    onCancelReplyCompose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    composeId: PropTypes.string,
    composeText: PropTypes.string,
    type: PropTypes.string,
  }

  state = {
    revealed: !!this.props.children,
  }

  activeElement = this.state.revealed ? document.activeElement : null

  handleKeyUp = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)
         && !!this.props.children) {
      this.handleOnClose()
    }
  }

  handleOnClose = () => {
    const { onOpenModal, composeText, composeId, onClose, intl, type, onCancelReplyCompose } = this.props

    if (!composeId && composeText && type == 'COMPOSE') {
      onOpenModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this status?' />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => onCancelReplyCompose(),
        onCancel: () => onOpenModal('COMPOSE'),
      })
    } else {
      onClose()
    }
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp, false)
  }

  componentWillReceiveProps (nextProps) {
    if (!!nextProps.children && !this.props.children) {
      this.activeElement = document.activeElement

      this.getSiblings().forEach(sibling => sibling.setAttribute('inert', true))
    } else if (!nextProps.children) {
      this.setState({ revealed: false })
    }

    if (!nextProps.children && !!this.props.children) {
      this.activeElement.focus()
      this.activeElement = null
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.props.children && !!prevProps.children) {
      this.getSiblings().forEach(sibling => sibling.removeAttribute('inert'))
    }

    if (this.props.children) {
      requestAnimationFrame(() => {
        this.setState({ revealed: true })
      })
    }
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  getSiblings = () => {
    return Array(...this.node.parentElement.childNodes).filter(node => node !== this.node)
  }

  setRef = ref => {
    this.node = ref
  }

  render () {
    const { children } = this.props

    const visible = !!children

    const containerClasses = cx({
      default: 1,
      z4: 1,
      displayNone: !visible,
    })

    return (
      <div ref={this.setRef} className={containerClasses}>
        {
          !!visible &&
          <Fragment>
            <div
              role='presentation'
              className={[_s.default, _s.backgroundColorPrimaryOpaque, _s.positionFixed, _s.z3, _s.top0, _s.right0, _s.bottom0, _s.left0].join(' ')}
              onClick={this.handleOnClose}
            />
            <div
              role='dialog'
              className={[_s.default, _s.positionFixed, _s.alignItemsCenter, _s.justifyContentCenter, _s.z4, _s.width100PC, _s.height100PC, _s.pointerEventsNone, _s.top0, _s.rightAuto, _s.bottomAuto, _s.left0].join(' ')}
            >
              {children}
            </div>
          </Fragment>
        }
      </div>
    )
  }

}