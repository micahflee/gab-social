import { Fragment } from 'react'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import { MODAL_HOME_TIMELINE_SETTINGS } from '../constants'
import IntersectionObserverArticle from '../components/intersection_observer_article'
import IntersectionObserverWrapper from '../features/ui/util/intersection_observer_wrapper'
import PageTitle from '../features/ui/util/page_title'
import GroupsPanel from '../components/panel/groups_panel'
import ListsPanel from '../components/panel/lists_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import UserPanel from '../components/panel/user_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'

const messages = defineMessages({
  home: { id: 'home', defaultMessage: 'Home' },
})

const mapStateToProps = (state) => ({
  totalQueuedItemsCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
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
  }

  intersectionObserverWrapper = new IntersectionObserverWrapper()

  componentDidMount() {
    this.attachIntersectionObserver()
  }

  componentWillUnmount() {
    this.detachIntersectionObserver()
  }

  attachIntersectionObserver() {
    this.intersectionObserverWrapper.connect()
  }

  detachIntersectionObserver() {
    this.intersectionObserverWrapper.disconnect()
  }

  render() {
    const {
      intl,
      children,
      totalQueuedItemsCount,
      onOpenHomePageSettingsModal,
    } = this.props

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.home)}
        actions={[
          // : todo :
          // {
          //   icon: 'ellipsis',
          //   onClick: onOpenHomePageSettingsModal,
          // },
        ]}
        layout={(
          <Fragment>
            <UserPanel />
            <ProgressPanel />
            <TrendsPanel />
            <IntersectionObserverArticle
              id={'home-sidebar-lists-panel'}
              listLength={7}
              index={4}
              intersectionObserverWrapper={this.intersectionObserverWrapper}
            >
              <ListsPanel />
            </IntersectionObserverArticle>
            <IntersectionObserverArticle
              id={'home-sidebar-wtf-panel'}
              listLength={7}
              index={5}
              intersectionObserverWrapper={this.intersectionObserverWrapper}
            >
              <WhoToFollowPanel />
            </IntersectionObserverArticle>
            <IntersectionObserverArticle
              id={'home-sidebar-groups-panel'}
              listLength={7}
              index={6}
              intersectionObserverWrapper={this.intersectionObserverWrapper}
            >
              <GroupsPanel isLazy />
            </IntersectionObserverArticle>
            <LinkFooter />
          </Fragment>
        )}
      >

        <PageTitle
          path={intl.formatMessage(messages.home)}
          badge={totalQueuedItemsCount}
        />
        
        <TimelineComposeBlock autoFocus={false} />
        
        <Divider />

        {children}

      </DefaultLayout>
    )
  }
}