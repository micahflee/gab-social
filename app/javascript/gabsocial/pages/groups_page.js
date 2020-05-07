import { Fragment } from 'react'
import { me } from '../initial_state'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import {
  MODAL_GROUP_CREATE,
  MODAL_PRO_UPGRADE,
} from '../constants'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import GroupsPanel from '../components/panel/groups_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  groups: { id: 'groups', defaultMessage: 'Groups' },
  featured: { id: 'featured', defaultMessage: 'Featured' },
  new: { id: 'new', defaultMessage: 'Just Added' },
  myGroups: { id: 'my_groups', defaultMessage: 'My Groups' },
  admin: { id: 'admin', defaultMessage: 'Admin' },
})

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenGroupCreateModal(isPro) {
    if (!isPro) {
      dispatch(openModal(MODAL_PRO_UPGRADE))
    } else {
      dispatch(openModal(MODAL_GROUP_CREATE))
    }
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupsPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    isPro: PropTypes.bool,
    onOpenGroupCreateModal: PropTypes.func.isRequired,
  }

  handleOnOpenGroupCreateModal = () => {
    this.props.onOpenGroupCreateModal(this.props.isPro)
  }

  render() {
    const {
      intl,
      children,
      isPro,
      onOpenGroupCreateModal,
    } = this.props

    const actions = [
      {
        icon: 'add',
        onClick: this.handleOnOpenGroupCreateModal,
      },
    ]
    const tabs = [
      {
        title: intl.formatMessage(messages.featured),
        to: '/groups',
      },
      {
        title: intl.formatMessage(messages.new),
        to: '/groups/new',
      },
      {
        title: intl.formatMessage(messages.myGroups),
        to: '/groups/browse/member',
      },
    ]

    if (isPro) {
      tabs.push({
        title: intl.formatMessage(messages.admin),
        to: '/groups/browse/admin',
      })
    }

    const title = intl.formatMessage(messages.groups)

    return (
      <DefaultLayout
        title={title}
        actions={actions}
        tabs={tabs}
        layout={(
          <Fragment>
            <WhoToFollowPanel />
            <GroupsPanel slim />
            <LinkFooter />
          </Fragment>
        )}
      >
        <PageTitle path={title} />
        { children }
      </DefaultLayout>
    )
  }

}