import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  LinkFooter,
  UserSuggestionsPanel,
  ProgressPanel,
} from '../features/ui/util/async_components'

class ProPage extends React.PureComponent {

  render() {
    const { intl, children } = this.props

    const title = intl.formatMessage(messages.title)

    return (
      <DefaultLayout
        showBackBtn
        title={title}
        page='pro'
        layout={[
          ProgressPanel,
          <WrappedBundle component={UserSuggestionsPanel} componentParams={{ suggestionType: 'verified' }} />,
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
  title: { 'id': 'column.pro', 'defaultMessage': 'Pro feed' },
})

ProPage.propTypes = {
  children: PropTypes.node.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(ProPage)