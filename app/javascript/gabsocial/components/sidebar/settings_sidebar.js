import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../../initial_state'
import SidebarSectionTitle from '../sidebar_section_title'
import SidebarSectionItem from '../sidebar_section_item'
import SidebarLayout from './sidebar_layout'

class SettingsSidebar extends React.PureComponent {

  render() {
    const { intl, title } = this.props

    if (!me) return null

    return (
      <SidebarLayout
        showBackBtn
        title={title}
      >
        <SidebarSectionTitle>{intl.formatMessage(messages.menu)}</SidebarSectionTitle>
        <SidebarSectionItem title={intl.formatMessage(messages.blocks)} to='/settings/blocks' />
        <SidebarSectionItem title={intl.formatMessage(messages.mutes)} to='/settings/mutes' />
        <SidebarSectionItem title={intl.formatMessage(messages.preferences)} to='/settings/preferences' />
      </SidebarLayout>
    )
  }

}

const messages = defineMessages({
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
})

SettingsSidebar.propTypes = {
  intl: PropTypes.object.isRequired,
  title: PropTypes.string,
}

export default injectIntl(SettingsSidebar)