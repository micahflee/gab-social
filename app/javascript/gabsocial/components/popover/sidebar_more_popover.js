import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import {  MODAL_DISPLAY_OPTIONS } from '../../constants'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import PopoverLayout from './popover_layout'
import List from '../list'

class SidebarMorePopover extends React.PureComponent {

  handleOnOpenDisplayModal = () => {
    this.props.onOpenDisplayModal()
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { intl, isXS } = this.props

    if (isXS) return null

    return (
      <PopoverLayout width={240}>
        <List
          size='small'
          scrollKey='profile_options'
          items={[
            {
              title: intl.formatMessage(messages.help),
              href: 'https://help.gab.com',
            },
            {
              title: 'Gab Deck',
              to: '/deck',
              onClick: this.handleOnClosePopover,
            },
            {
              title: intl.formatMessage(messages.display),
              onClick: this.handleOnOpenDisplayModal,
            },
            {
              title: intl.formatMessage(messages.blocks),
              to: '/settings/blocks',
            },
            {
              title: intl.formatMessage(messages.mutes),
              to: '/settings/mutes',
            },
            {
              title: intl.formatMessage(messages.settings),
              href: '/settings/preferences',
            },
            {
              title: intl.formatMessage(messages.logout),
              href: '/auth/sign_out',
            },
          ]}
        />
      </PopoverLayout>
    )
  }
}

const messages = defineMessages({
  display: { id: 'display_options', defaultMessage: 'Display Options' },
  help: { id: 'getting_started.help', defaultMessage: 'Help' },
  settings: { id: 'settings', defaultMessage: 'Settings' },
  logout: { 'id': 'confirmations.logout.confirm', 'defaultMessage': 'Log out' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
})

const mapDispatchToProps = (dispatch) => ({
  onClosePopover() {
    dispatch(closePopover())
  },
  onOpenDisplayModal: () => {
    dispatch(closePopover())
    dispatch(openModal(MODAL_DISPLAY_OPTIONS))
  },
})

SidebarMorePopover.propTypes = {
  intl: PropTypes.object.isRequired,
  onOpenDisplayModal: PropTypes.func.isRequired,
  isXS: PropTypes.bool,
}

export default injectIntl(connect(null, mapDispatchToProps)(SidebarMorePopover))
