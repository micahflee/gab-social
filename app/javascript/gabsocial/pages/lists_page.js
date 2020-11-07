import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import { MODAL_LIST_CREATE } from '../constants'
import {
  LinkFooter,
  TrendsBreakingPanel,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class ListsPage extends React.PureComponent {

  onOpenListCreateModal = () => {
    this.props.dispatch(openModal(MODAL_LIST_CREATE))
  }

  render() {
    const { children, intl } = this.props

    const title = intl.formatMessage(messages.lists)

    return (
      <DefaultLayout
        showBackBtn
        title={title}
        page='lists'
        actions={[
          {
            icon: 'add',
            onClick: this.onOpenListCreateModal,
          },
        ]}
        layout={[
          TrendsBreakingPanel,
          UserSuggestionsPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}

const messages = defineMessages({
  lists: { id: 'lists', defaultMessage: 'Lists' },
})

ListsPage.propTypes = {
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default injectIntl(connect()(ListsPage))