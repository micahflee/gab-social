import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { openPopover } from '../../../actions/popover'
import ComposeExtraButton from './compose_extra_button'

class StatusVisibilityButton extends React.PureComponent {

  handleOnClick = () => {
    this.props.onOpenPopover(this.button)
  }

  setButton = (n) => {
    this.button = n
  }

  render() {
    const {
      intl,
      small,
      value,
    } = this.props

    let icon;
    switch (value) {
    case 'unlisted':
      icon = 'unlock-filled'
      break;
    case 'private':
      icon = 'lock-filled'
      break;
    default:
      icon = 'globe'
      break;
    }

    return (
      <ComposeExtraButton
        icon={icon}
        title={intl.formatMessage(messages.visibility)}
        onClick={this.handleOnClick}
        small={small}
        buttonRef={this.setButton}
        iconClassName={_s.cIconComposeSensitive}
      />
    )
  }

}

const messages = defineMessages({
  visibility: { id: 'privacy.visibility', defaultMessage: 'Visibility' },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['compose', 'privacy']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenPopover(targetRef) {
    dispatch(openPopover('STATUS_VISIBILITY', {
      targetRef,
    }))
  },
})

StatusVisibilityButton.propTypes = {
  intl: PropTypes.object.isRequired,
  small: PropTypes.bool,
  onOpenPopover: PropTypes.func.isRequired,
  value: PropTypes.oneOf([
    'private',
    'unlisted',
    'public',
  ]),
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(StatusVisibilityButton))
