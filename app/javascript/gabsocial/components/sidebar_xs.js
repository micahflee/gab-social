import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { CX } from '../constants'
import Avatar from './avatar'
import DisplayName from './display_name'
import Button from './button'
import Heading from './heading'
import Image from './image'
import Text from './text'
import List from './list'
import { closeSidebar } from '../actions/sidebar'
import { openModal } from '../actions/modal'
import { shortNumberFormat } from '../utils/numbers'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  ProgressPanel,
} from '../features/ui/util/async_components'

class SidebarXS extends ImmutablePureComponent {

  componentDidUpdate () {
    if (!me) return

    if (this.props.sidebarOpen) {
      document.body.classList.add(_s.overflowYHidden)
    } else {
      document.body.classList.remove(_s.overflowYHidden)
    }
  }

  handleSidebarClose = () => {
    document.body.classList.remove(_s.overflowYHidden) 
    this.props.onCloseSidebar()
  }

  render () {
    const { sidebarOpen, intl, account } = this.props

    if (!me || !account) return null

    const acct = account.get('acct')
    const isPro = account.get('is_pro')

    const containerClasses = CX({
      d: 1,
      posFixed: 1,
      top0: 1,
      left0: 1,
      right0: 1,
      bottom0: 1,
      z5: 1,
      displayNone: !sidebarOpen,
    })
        
    return (
      <div className={containerClasses}>
        <div className={[_s.d, _s.posFixed, _s.top0, _s.left0, _s.right0, _s.bgBlackOpaque, _s.bottom0].join(' ')} role='button' onClick={this.handleSidebarClose} />
        <div className={[_s.defaut, _s.posFixed, _s.right0, _s.top0, _s.bottom0, _s.bgSecondary, _s.saveAreaInsetPT, _s.saveAreaInsetPB, _s.saveAreaInsetPL, _s.minW330PX, _s.borderRight1PX, _s.borderColorSecondary, _s.maxW80PC, _s.overflowYScroll].join(' ')}>

          <div
            className={[_s.d, _s.h122PX].join(' ')}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
          >
            <Image
              alt={intl.formatMessage(messages.headerPhoto)}
              className={_s.h122PX}
              src={account.get('header_static')}
            />
            <Button
              title='close'
              color='white'
              backgroundColor='none'
              onClick={this.handleSidebarClose}
              icon='close'
              iconSize='12px'
              className={[_s.posAbs, _s.top0, _s.right0, _s.mr10, _s.mt10].join(' ')}
            />
          </div>

          <div className={[_s.d, _s.px15, _s.w100PC, _s.pb15, _s.bgPrimary, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')}>
            <div className={[_s.d].join(' ')}>

              <div className={[_s.d, _s.flexRow].join(' ')}>
                <div className={[_s.d, _s.mtNeg32PX].join(' ')}>
                  <NavLink
                    to={`/${acct}`}
                    title={acct}
                    onClick={this.handleSidebarClose}
                    className={[_s.boxShadowProfileAvatar, _s.w84PX, _s.circle].join(' ')}
                  >
                    <Avatar account={account} size={84} />
                  </NavLink>
                </div>
                <div className={[_s.d, _s.px15, _s.pt10].join(' ')}>
                  <DisplayName account={account} isMultiline />
                </div>
              </div>
            </div>
          </div>

          <div className={[_s.d, _s.w100PC].join(' ')}>
            <div className={[_s.d, _s.boxShadowNone].join(' ')}>
              <List
                items={[
                  {
                    to: `/${acct}`,
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.profile),
                  },
                  {
                    to: '/lists',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.lists),
                  },
                  {
                    to: '/shortcuts',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.shortcuts),
                  },
                ]}
              />
            </div>
          </div>

          <div className={[_s.d, _s.w100PC].join(' ')}>
            <div className={[_s.d, _s.mt5, _s.boxShadowNone].join(' ')}>
              <div className={[_s.py10, _s.px15].join(' ')}>
                <Text color='secondary' size='small' weight='medium'>Preferences</Text>
              </div>

              <List
                items={[
                  {
                    onClick: this.props.onOpenDisplayModel, //on open display model
                    title: intl.formatMessage(messages.display),
                  },
                  {
                    href: '/settings/preferences',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.settings),
                  },
                  {
                    to: '/settings/blocks',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.blocks),
                  },
                  {
                    to: '/settings/mutes',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.mutes),
                  },
                ]}
              />
            </div>
          </div>

          <div className={[_s.d, _s.w100PC, _s.pb35, _s.mb15].join(' ')}>
            <div className={[_s.d, _s.mt5, _s.boxShadowNone, _s.pb35, _s.mb15].join(' ')}>
              <div className={[_s.py10, _s.px15].join(' ')}>
                <Text color='secondary' size='small' weight='medium'>More</Text>
              </div>

              <List
                items={[
                  {
                    to: '/timeline/pro',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.proFeed),
                  },
                  {
                    href: 'https://pro.gab.com',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.pro),
                  },
                  {
                    href: 'https://shop.dissenter.com',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.shop),
                  },
                  {
                    href: 'https://help.gab.com',
                    onClick: this.handleSidebarClose,
                    title: intl.formatMessage(messages.help),
                  },
                  {
                    href: '/auth/sign_out',
                    title: intl.formatMessage(messages.logout),
                  },
                ]}
              />
            </div>
          </div>

        </div>
      </div>
    )
  }

}

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  settings: { id: 'navigation_bar.settings', defaultMessage: 'Settings' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  lists: { id: 'column.lists', defaultMessage: 'Lists', },
  apps: { id: 'tabs_bar.apps', defaultMessage: 'Apps' },
  more: { id: 'sidebar.more', defaultMessage: 'More' },
  pro: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  trends: { id: 'promo.trends', defaultMessage: 'Trends' },
  search: { id: 'tabs_bar.search', defaultMessage: 'Search' },
  shop: { id: 'tabs_bar.shop', defaultMessage: 'Store - Buy Merch' },
  chat: { id: 'tabs_bar.chat', defaultMessage: 'Chat' },
  help: { id: 'getting_started.help', defaultMessage: 'Help' },
  display: { id: 'display_options', defaultMessage: 'Display Options' },
  proFeed: { id: 'pro_feed', defaultMessage: 'Pro Feed' },
  shortcuts: { id: 'shortcuts', defaultMessage: 'Shortcuts' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
})

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  sidebarOpen: state.get('sidebar').open,
})

const mapDispatchToProps = (dispatch) => ({
  onCloseSidebar: () => dispatch(closeSidebar()),
  onOpenDisplayModel() {
    dispatch(closeSidebar())
    dispatch(openModal('DISPLAY_OPTIONS'))
  }
})

SidebarXS.propTypes = {
  intl: PropTypes.object.isRequired,
  account: ImmutablePropTypes.map,
  sidebarOpen: PropTypes.bool,
  onCloseSidebar: PropTypes.func.isRequired,
  onOpenDisplayModel: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SidebarXS))