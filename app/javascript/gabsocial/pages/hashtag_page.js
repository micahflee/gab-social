import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import { MODAL_HASHTAG_TIMELINE_SETTINGS } from '../constants'
import {
  LinkFooter,
  ProgressPanel,
  TrendsPanel,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class HashtagPage extends React.PureComponent {

  onOpenHashtagPageSettingsModal = () => {
    const { params } = this.props

    const hashtag = isObject(params) ? params.id : ''
    if (!hashtag) return

    this.props.dispatch(openModal(MODAL_HASHTAG_TIMELINE_SETTINGS, {
      hashtag,
    }))
  }

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
        actions={[
          {
            icon: 'ellipsis',
            onClick: this.onOpenHashtagPageSettingsModal,
          },
        ]}
        layout={[
          ProgressPanel,
          TrendsPanel,
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

export default injectIntl(connect()(HashtagPage))