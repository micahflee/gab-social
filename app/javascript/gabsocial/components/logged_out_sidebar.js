import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import SidebarSectionTitle from './sidebar_section_title'
import SidebarSectionItem from './sidebar_section_item'
import Heading from './heading'
import LinkFooter from './link_footer'

class Sidebar extends React.PureComponent {

  render() {
    const {
      intl,
      title,
      showLinkFooter,
    } = this.props

    if (!!me) return null

    const menuItems = [
      {
        title: 'Home',
        icon: 'home',
        to: '/',
      },
      {
        title: 'Search',
        icon: 'search-alt',
        to: '/search',
      },
      {
        title: 'Groups',
        icon: 'group',
        to: '/groups',
      },
      {
        title: 'News',
        icon: 'news',
        to: '/news',
      },
    ]

    const exploreItems = [
      {
        title: 'Apps',
        icon: 'apps',
        href: 'https://apps.gab.com',
      },
      {
        title: 'Shop',
        icon: 'shop',
        href: 'https://shop.dissenter.com',
      },
      {
        title: 'Trends',
        icon: 'trends',
        href: 'https://trends.gab.com',
      },
      {
        title: 'Dissenter',
        icon: 'dissenter',
        href: 'https://dissenter.com',
      },
    ]

    return (
      <header role='banner' className={[_s.default, _s.flexGrow1, _s.z3, _s.alignItemsEnd].join(' ')}>
        <div className={[_s.default, _s.width240PX].join(' ')}>
          <div className={[_s.default, _s.posFixed, _s.heightCalc53PX, _s.bottom0].join(' ')}>
            <div className={[_s.default, _s.height100PC, _s.alignItemsStart, _s.width240PX, _s.pr15, _s.py10, _s.noScrollbar, _s.overflowYScroll].join(' ')}>
              <div className={[_s.default, _s.width100PC].join(' ')}>
                {
                  !!title &&
                  <div className={[_s.default, _s.flexRow, _s.px5, _s.pt10].join(' ')}>
                    <Heading size='h1'>
                      {title}
                    </Heading>
                  </div>
                }
              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.default, _s.width100PC, _s.mb15].join(' ')}>
                <SidebarSectionTitle>{intl.formatMessage(messages.menu)}</SidebarSectionTitle>
                {
                  menuItems.map((menuItem, i) => {
                    if (menuItem.hidden) return null

                    return (
                      <SidebarSectionItem {...menuItem} key={`sidebar-item-menu-${i}`} />
                    )
                  })
                }
                <SidebarSectionTitle>{intl.formatMessage(messages.explore)}</SidebarSectionTitle>
                {
                  exploreItems.map((exploreItem, i) => (
                    <SidebarSectionItem {...exploreItem} key={`sidebar-item-explore-${i}`} />
                  ))
                }
              </nav>

              {
                showLinkFooter && <LinkFooter noPadding />
              }
            </div>
          </div>
        </div>
      </header>
    )
  }

}

const messages = defineMessages({
  explore: { id: 'explore', defaultMessage: 'Explore' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
})

Sidebar.propTypes = {
  intl: PropTypes.object.isRequired,
  showLinkFooter: PropTypes.bool,
  title: PropTypes.string,
}

export default injectIntl(Sidebar)