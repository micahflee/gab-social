import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  ProgressPanel,
  TrendsBreakingPanel,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class HashtagPage extends React.PureComponent {

  render() {
    const {
      children,
      intl,
      params,
    } = this.props

    const hashtag = isObject(params) ? params.id : ''

    return (
      <DefaultLayout
        showBackBtn
        title={intl.formatMessage(messages.hashtagTimeline)}
        page={`hashtag.${hashtag}`}
        layout={[
          ProgressPanel,
          TrendsBreakingPanel,
          UserSuggestionsPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={intl.formatMessage(messages.hashtag)} />
        {children}
      </DefaultLayout>
    )
  }
}

const messages = defineMessages({
  hashtag: { id: 'hashtag', defaultMessage: 'Hashtag' },
  hashtagTimeline: { id: 'hashtag_timeline', defaultMessage: 'Hashtag timeline' },
})

HashtagPage.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
}

export default injectIntl(HashtagPage)