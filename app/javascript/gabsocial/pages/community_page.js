import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import { MODAL_COMMUNITY_TIMELINE_SETTINGS } from '../constants'
import {
  LinkFooter,
  GroupsPanel,
  ProgressPanel,
  TrendsPanel,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class CommunityPage extends React.PureComponent {

  onOpenCommunityPageSettingsModal = () => {
    this.props.dispatch(openModal(MODAL_COMMUNITY_TIMELINE_SETTINGS))
  }

  render() {
    const { children, intl } = this.props

    const title = intl.formatMessage(messages.community)

    return (
      <DefaultLayout
        title={title}
        page='community'
        actions={[
          {
            icon: 'ellipsis',
            onClick: this.onOpenCommunityPageSettingsModal,
          },
        ]}
        layout={[
          ProgressPanel,
          TrendsPanel,
          UserSuggestionsPanel,
          GroupsPanel,
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
  community: { 'id': 'column.community', 'defaultMessage': 'Community feed' },
})

CommunityPage.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect()(CommunityPage))
