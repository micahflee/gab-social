import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../../initial_state'
import SidebarSectionTitle from '../sidebar_section_title'
import SidebarSectionItem from '../sidebar_section_item'
import SidebarLayout from './sidebar_layout'

class LoggedOutSidebar extends React.PureComponent {

  render() {
    const { intl, title } = this.props

    if (!!me) return null
   
    return (
      <SidebarLayout title={title}>
        <SidebarSectionTitle>{intl.formatMessage(messages.menu)}</SidebarSectionTitle>
        <SidebarSectionItem title='Home' icon='home' to='/home' />
        <SidebarSectionItem title='Search' icon='search-alt' to='/search' />
        <SidebarSectionItem title='Groups' icon='group' to='/groups' />
        <SidebarSectionItem title='News' icon='news' to='/news' />
        <SidebarSectionItem title='About' icon='list' to='/about' />
        
        <SidebarSectionTitle>{intl.formatMessage(messages.explore)}</SidebarSectionTitle>
        <SidebarSectionItem title='Apps' icon='apps' href='https://apps.gab.com' />
        <SidebarSectionItem title='Shop' icon='shop' href='https://shop.dissenter.com' />
        <SidebarSectionItem title='Trends' icon='trends' href='https://trends.gab.com' />
        <SidebarSectionItem title='Dissenter' icon='dissenter' href='https://dissenter.com' />
      </SidebarLayout>
    )
  }

}

const messages = defineMessages({
  explore: { id: 'explore', defaultMessage: 'Explore' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
})

LoggedOutSidebar.propTypes = {
  intl: PropTypes.object.isRequired,
  title: PropTypes.string,
}

export default injectIntl(LoggedOutSidebar)