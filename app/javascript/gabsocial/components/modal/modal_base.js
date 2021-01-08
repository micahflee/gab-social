import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { openModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../../constants'

class ModalBase extends React.PureComponent {

  state = {
    revealed: !!this.props.children,
  }

  activeElement = this.state.revealed ? document.activeElement : null

  handleKeyUp = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && !!this.props.children) {
      this.handleOnClose()
    }
  }

  handleOnClose = (e) => {
    const { onOpenModal, composeText, composeId, onClose, intl, type, onCancelReplyCompose } = this.props

    if (!!e && this.dialog !== e.target) return

    if (!composeId && composeText && type === 'COMPOSE') {
      onOpenModal('CONFIRM', {
        message: intl.formatMessage(messages.delete),
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => onCancelReplyCompose(),
        onCancel: () => onOpenModal('COMPOSE'),
      })
    } else {
      onClose()
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp, false)
  }

  componentWillReceiveProps(nextProps) {
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

  componentDidUpdate(prevProps) {
    if (!this.props.children && !!prevProps.children) {
      this.getSiblings().forEach(sibling => sibling.removeAttribute('inert'))
    }

    if (this.props.children) {
      requestAnimationFrame(() => {
        this.setState({ revealed: true })
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  getSiblings = () => {
    return Array(...this.node.parentElement.childNodes).filter(node => node !== this.node)
  }

  setRef = (n) => {
    this.node = n
  }

  setDialog = (n) => {
    this.dialog = n
  }

  render() {
    const { children, isCenteredXS, width } = this.props

    const isXS = width <= BREAKPOINT_EXTRA_SMALL
    const visible = !!children

    const containerClasses = CX({
      d: 1,
      z4: 1,
      h100PC: visible,
      w100PC: visible,
      displayNone: !visible,
    })

    const dialogClasses = CX({
      d: 1,
      posFixed: 1,
      aiCenter: 1,
      jcCenter: !isXS || isCenteredXS,
      jcEnd: isXS && !isCenteredXS,
      z4: 1,
      w100PC: 1,
      h100PC: 1,
      top0: 1,
      rightAuto: 1,
      bottomAuto: 1,
      left0: 1,
    })

    return (
      <div ref={this.setRef} className={containerClasses}>
        {
          !!visible &&
          <React.Fragment>
            <div
              role='presentation'
              className={[_s.d, _s.bgBlackOpaque, _s.posFixed, _s.z3, _s.top0, _s.right0, _s.bottom0, _s.left0].join(' ')}
            />
            <div
              ref={this.setDialog}
              role='dialog'
              onClick={this.handleOnClose}
              className={dialogClasses}
            >
              {children}
            </div>
          </React.Fragment>
        }
      </div>
    )
  }

}

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  delete: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this status?' },
})

const mapStateToProps = (state) => ({
  composeId: state.getIn(['compose', 'id']),
  composeText: state.getIn(['compose', 'text']),
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenModal(type, opts) {
    dispatch(openModal(type, opts))
  },
  onCancelReplyCompose() {
    dispatch(cancelReplyCompose())
  },
})

ModalBase.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  onCancelReplyCompose: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  composeId: PropTypes.string,
  composeText: PropTypes.string,
  type: PropTypes.string,
  isCenteredXS: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ModalBase))