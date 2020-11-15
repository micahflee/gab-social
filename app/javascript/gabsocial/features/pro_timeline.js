import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { expandProTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'

class ProTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount () {
    const { dispatch } = this.props

    dispatch(expandProTimeline())
  }
  
  handleLoadMore = (maxId) => {
    const { dispatch } = this.props

    dispatch(expandProTimeline({ maxId }))
  }

  render () {
    const { intl } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='pro_timeline'
        timelineId='pro'
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    )
  }

}

const messages = defineMessages({
  empty: { id: 'empty_column.pro', defaultMessage: 'The pro timeline is empty.' },
})

ProTimeline.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect(null)(ProTimeline))