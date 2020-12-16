import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  GroupsPanel,
  ProgressPanel,
  TrendsBreakingPanel,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class CommunityPage extends React.PureComponent {

  render() {
    const { children, intl } = this.props

    const title = intl.formatMessage(messages.community)

    return (
      <DefaultLayout
        title={title}
        page='community'
        layout={[
          ProgressPanel,
          TrendsBreakingPanel,
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

export default injectIntl(CommunityPage)
