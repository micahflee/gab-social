import React from 'react'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { openModal } from '../../../actions/modal'
import { openPopover } from '../../../actions/popover'
import { me } from '../../../initial_state'
import { POPOVER_STATUS_EXPIRATION_OPTIONS } from '../../../constants'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  expires: { id: 'expiration.title', defaultMessage: 'Add status expiration' },
})

const mapStateToProps = (state) => ({
  hasScheduledAt: !!state.getIn(['compose', 'scheduled_at']),
  active: !!state.getIn(['compose', 'expires_at']) || state.getIn(['popover', 'popoverType']) === POPOVER_STATUS_EXPIRATION_OPTIONS,
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenExpirationPopover(targetRef) {
    dispatch(openPopover(POPOVER_STATUS_EXPIRATION_OPTIONS, {
      targetRef,
    }))
  },
  onOpenProUpgradeModal() {
    dispatch(openModal('PRO_UPGRADE'))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class ExpiresPostButton extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool,
    hasScheduledAt: PropTypes.bool,
    onOpenProUpgradeModal: PropTypes.func.isRequired,
    onOpenExpirationPopover: PropTypes.func.isRequired,
    small: PropTypes.bool,
  }

  handleToggle = () => {
    if (!this.props.isPro) {
      this.props.onOpenProUpgradeModal()
    } else {
      this.props.onOpenExpirationPopover(this.button)
    }
  }

  setButton = (n) => {
    this.button = n
  }

  render () {
    const {
      active,
      intl,
      hasScheduledAt,
      small,
    } = this.props

    if (hasScheduledAt) return null

    return (
      <ComposeExtraButton
        active={active}
        buttonRef={this.setButton}
        icon='stopwatch'
        onClick={this.handleToggle}
        small={small}
        title={intl.formatMessage(messages.expires)}
      />
    )
  }

}
