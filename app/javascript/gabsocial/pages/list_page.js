import React from 'react'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import {
  MODAL_LIST_EDITOR,
} from '../constants'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  ListDetailsPanel,
  LinkFooter,
  TrendsPanel,
  WhoToFollowPanel,
} from '../features/ui/util/async_components'

class ListPage extends ImmutablePureComponent {
  
  onOpenListEditModal = () => {
    const { list } = this.props
    
    if (!list) return
    
    this.props.dispatch(openModal(MODAL_LIST_EDITOR, {
      id: list.get('id'),
    }))
  }

  render() {
    const {
      children,
      intl,
      list,
    } = this.props

    const listTitle = !!list ? list.get('title') : ''
    const title = intl.formatMessage(messages.list)

    return (
      <DefaultLayout
        showBackBtn
        title={title}
        page='list'
        actions={[
          {
            icon: 'cog',
            onClick: this.onOpenListEditModal,
          },
        ]}
        layout={[
          <WrappedBundle component={ListDetailsPanel} componentParams={{ list: list, onEdit: this.handleOnOpenListEditModal }} />,
          TrendsPanel,
          WhoToFollowPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={[listTitle, title]} />
        { children }
      </DefaultLayout>
    )
  }
}

const messages = defineMessages({
  list: { id: 'list', defaultMessage: 'List' },
})

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
})

ListPage.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  list: ImmutablePropTypes.map,
}

export default injectIntl(connect(mapStateToProps)(ListPage))