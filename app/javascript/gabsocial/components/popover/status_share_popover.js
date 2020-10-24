import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import {
  MODAL_EMBED,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

class StatusSharePopover extends ImmutablePureComponent {

  handleOnOpenEmbedModal = () => {
    this.props.onOpenEmbedModal(this.props.status.get('url'))
    this.props.onClosePopover()
  }

  handleCopy = () => {
    const url = this.props.status.get('url')
    const textarea = document.createElement('textarea')

    textarea.textContent = url
    textarea.style.position = 'fixed'

    document.body.appendChild(textarea)

    try {
      textarea.select()
      document.execCommand('copy')
    } catch (e) {
      //
    }

    document.body.removeChild(textarea)
    this.handleClosePopover()
  }

  handleClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { intl, status } = this.props

    const mailToHref = !status ? undefined : `mailto:?subject=Gab&body=${status.get('url')}`

    return (
      <PopoverLayout width={240}>
        <List
          size='small'
          scrollKey='profile_options'
          items={[
            {
              title: intl.formatMessage(messages.copy),
              onClick: this.handleCopy,
            },
            {
              title: intl.formatMessage(messages.email),
              href: mailToHref,
            },
            {
              title: intl.formatMessage(messages.embed),
              onClick: this.handleOnOpenEmbedModal,
            },
          ]}
        />
      </PopoverLayout>
    )
  }
}

const messages = defineMessages({
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  email: { id: 'status.email', defaultMessage: 'Email this gab' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to status' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenEmbedModal(url) {
    dispatch(closePopover())
    dispatch(openModal(MODAL_EMBED, {
      url,
    }))
  },
  onClosePopover: () => dispatch(closePopover()),
})

StatusSharePopover.propTypes = {
  intl: PropTypes.object.isRequired,
  onOpenEmbedModal: PropTypes.func.isRequired,
  onClosePopover: PropTypes.func.isRequired,
  status: ImmutablePropTypes.map.isRequired,
}

export default injectIntl(connect(null, mapDispatchToProps)(StatusSharePopover))
