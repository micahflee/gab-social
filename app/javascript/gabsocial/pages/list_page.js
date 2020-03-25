import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openModal } from '../actions/modal'
import LinkFooter from '../components/link_footer'
import DefaultLayout from '../layouts/default_layout'
import ListDetailsPanel from '../components/panel/list_details_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
})

const mapDispatchToProps = (dispatch, { list }) => ({
  onOpenListEditModal() {
    dispatch(openModal('GROUP_DELETE', {
      list,
    }))
  },
  onOpenListTimelineSettingsModal() {
    dispatch(openModal('LIST_TIMELINE_SETTINGS'))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class ListPage extends ImmutablePureComponent {

  static propTypes = {
    list: ImmutablePropTypes.map,
    onOpenListEditModal: PropTypes.func.isRequired,
    onOpenListTimelineSettingsModal: PropTypes.func.isRequired,
  }

  componentDidMount() {
		const { list } = this.props
		const listTitle = !list ? '...' : list.get('title')
    document.title = `List / ${listTitle} - Gab`
  }
  
  render() {
    const {
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
        { children }
      </DefaultLayout>
    )
  }
}