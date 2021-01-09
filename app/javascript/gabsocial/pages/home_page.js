import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import throttle from 'lodash.throttle'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import {
  MODAL_HOME_TIMELINE_SETTINGS,
  LAZY_LOAD_SCROLL_OFFSET,
} from '../constants'
import { me } from '../initial_state'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import TabBar from '../components/tab_bar'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  UserPanel,
  GroupsPanel,
  LinkFooter,
  ListsPanel,
  TrendsBreakingPanel,
  UserSuggestionsPanel,
  ProPanel,
  ShopPanel,
  ProgressPanel,
} from '../features/ui/util/async_components'

class HomePage extends React.PureComponent {

  state = {
    lazyLoaded: false,
  }

  componentDidMount() {
    this.window = window
    this.documentElement = document.scrollingElement || document.documentElement

    this.window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  detachScrollListener = () => {
    this.window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { scrollTop } = this.documentElement
      
      if (scrollTop > LAZY_LOAD_SCROLL_OFFSET && !this.state.lazyLoaded) {
        this.setState({ lazyLoaded: true })
        this.detachScrollListener()
      }
    }
  }, 150, {
    trailing: true,
  })

  onOpenHomePageSettingsModal = () => {
    this.props.dispatch(openModal(MODAL_HOME_TIMELINE_SETTINGS))
  }

  render() {
    const {
      children,
      intl,
      isPro,
      totalQueuedItemsCount,
      unreadChatsCount,
    } = this.props
    const { lazyLoaded } = this.state

    const title = intl.formatMessage(messages.home)

    return (
      <DefaultLayout
        page='home'
        title={title}
        actions={[
          {
            icon: 'tv',
            href: 'https://tv.gab.com',
          },
          {
            icon: 'chat',
            to: '/messages',
            count: unreadChatsCount,
          },
          {
            icon: 'search',
            to: '/search',
          },
        ]}
        layout={[
          UserPanel,
          ProgressPanel,
          <WrappedBundle component={ProPanel} componentParams={{ isPro: isPro }} />,
          <WrappedBundle component={TrendsBreakingPanel} />,
          <WrappedBundle component={ShopPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }}  />,
          // <WrappedBundle component={ListsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }}  />,
          // <WrappedBundle component={UserSuggestionsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded }}  />,
          // <WrappedBundle component={GroupsPanel} componentParams={{ isLazy: true, shouldLoad: lazyLoaded, groupType: 'member' }}  />,
          LinkFooter,
        ]}
      >

        <PageTitle
          path={title}
          badge={totalQueuedItemsCount}
        />

        <TimelineComposeBlock autoFocus={false} />
        {children}
        
      </DefaultLayout>
    )
  }
}

const messages = defineMessages({
  home: { id: 'home', defaultMessage: 'Home' },
})

const mapStateToProps = (state) => ({
  totalQueuedItemsCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
  unreadChatsCount: state.getIn(['chats', 'chatsUnreadCount']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

HomePage.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isPro: PropTypes.bool,
  unreadChatsCount: PropTypes.number.isRequired,
  totalQueuedItemsCount: PropTypes.number.isRequired,
}

export default injectIntl(connect(mapStateToProps)(HomePage))