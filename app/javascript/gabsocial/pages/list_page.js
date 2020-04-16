import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import DefaultLayout from '../layouts/default_layout'
import ListDetailsPanel from '../components/panel/list_details_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'

const messages = defineMessages({
  list: { id: 'list', defaultMessage: 'List' },
})

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
})

const mapDispatchToProps = (dispatch, { list }) => ({
  onOpenListEditModal() {
    dispatch(openModal('LIST_EDIT', {
      list,
    }))
  },
  onOpenListTimelineSettingsModal() {
    dispatch(openModal('LIST_TIMELINE_SETTINGS'))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class ListPage extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    list: ImmutablePropTypes.map,
    children: PropTypes.node.isRequired,
    onOpenListEditModal: PropTypes.func.isRequired,
    onOpenListTimelineSettingsModal: PropTypes.func.isRequired,
  }
  
  render() {
    const {
      intl,
      children,
      list,
      onOpenListEditModal,
      onOpenListTimelineSettingsModal
    } = this.props

    const title = !!list ? list.get('title') : ''

    return (
      <DefaultLayout
        title={title}
        actions={[
          {
            icon: 'list-edit',
            onClick: onOpenListEditModal,
          },
          {
            icon: 'ellipsis',
            onClick: onOpenListTimelineSettingsModal,
          },
        ]}
        layout={(
          <Fragment>
            <ListDetailsPanel />
            <TrendsPanel />
            <WhoToFollowPanel />
            <LinkFooter />
          </Fragment>
        )}
        showBackBtn
      >
        <PageTitle path={[title, intl.formatMessage(messages.list)]} />
        { children }
      </DefaultLayout>
    )
  }
}