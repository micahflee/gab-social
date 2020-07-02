import { Fragment } from 'react'
import throttle from 'lodash.throttle'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import { MODAL_HOME_TIMELINE_SETTINGS } from '../constants'
import { me } from '../initial_state'
import PageTitle from '../features/ui/util/page_title'
import GroupsPanel from '../components/panel/groups_panel'
import ListsPanel from '../components/panel/lists_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ShopPanel from '../components/panel/shop_panel'
import ProgressPanel from '../components/panel/progress_panel'
import ProPanel from '../components/panel/pro_panel'
import UserPanel from '../components/panel/user_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'
import PullToRefresher from '../components/pull_to_refresher'

const messages = defineMessages({
  home: { id: 'home', defaultMessage: 'Home' },
})

const mapStateToProps = (state) => ({
  totalQueuedItemsCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHomePageSettingsModal() {
    dispatch(openModal(MODAL_HOME_TIMELINE_SETTINGS))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class HomePage extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    intl: PropTypes.object.isRequired,
    onOpenHomePageSettingsModal: PropTypes.func.isRequired,
    totalQueuedItemsCount: PropTypes.number.isRequired,
    isPro: PropTypes.bool,
  }

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
      
      if (scrollTop > 25 && !this.state.lazyLoaded) {
        this.setState({ lazyLoaded: true })
        this.detachScrollListener()
      }
    }
  }, 150, {
    trailing: true,
  })

  render() {
    const {
      intl,
      children,
      totalQueuedItemsCount,
      onOpenHomePageSettingsModal,
      isPro,
    } = this.props
    const { lazyLoaded } = this.state

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.home)}
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenHomePageSettingsModal,
          },
        ]}
        layout={(
          <Fragment>
            <UserPanel />
            <ProgressPanel />
            <ProPanel isPro={isPro} />
            <TrendsPanel />
            <ShopPanel isLazy shouldLoad={lazyLoaded} />
            <ListsPanel isLazy shouldLoad={lazyLoaded} />
            <WhoToFollowPanel isLazy shouldLoad={lazyLoaded} />
            <GroupsPanel isLazy shouldLoad={lazyLoaded} />
            <LinkFooter />
          </Fragment>
        )}
      >

        <PageTitle
          path={intl.formatMessage(messages.home)}
          badge={totalQueuedItemsCount}
        />
        
        <PullToRefresher />

        <TimelineComposeBlock autoFocus={false} />
        
        <Divider />

        {children}

      </DefaultLayout>
    )
  }
}