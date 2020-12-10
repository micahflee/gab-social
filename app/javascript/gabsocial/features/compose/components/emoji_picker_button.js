import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { openPopover } from '../../../actions/popover'
import ComposeExtraButton from './compose_extra_button'

class EmojiPickerButton extends React.PureComponent {

  handleClick = (e) => {
    e.preventDefault()
    this.props.onClick(this.button)
  }

  setButton = (n) => {
    this.button = n
  }

  render() {
    const {
      active,
      intl,
      isMatch,
      small,
    } = this.props

    return (
      <ComposeExtraButton
        title={intl.formatMessage(messages.emoji)}
        onClick={this.handleClick}
        icon='happy'
        active={active && isMatch}
        buttonRef={this.setButton}
        small={small}
        iconClassName={_s.cIconComposeEmoji}
      />
    )
  }

}

const messages = defineMessages({
  emoji: { id: 'emoji_button.label', defaultMessage: 'Insert emoji' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['popover', 'popoverType']) === 'EMOJI_PICKER',
})

const mapDispatchToProps = (dispatch) => ({
  onClick(targetRef) {
    dispatch(openPopover('EMOJI_PICKER', {
      targetRef,
    }))
  },
})

EmojiPickerButton.propTypes = {
  intl: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  isMatch: PropTypes.bool,
  small: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(EmojiPickerButton))