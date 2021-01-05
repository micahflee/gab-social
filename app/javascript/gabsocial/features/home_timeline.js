import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import throttle from 'lodash.throttle'
import {
  expandHomeTimeline,
  forceDequeueTimeline,
} from '../actions/timelines'
import StatusList from '../components/status_list'

class HomeTimeline extends React.PureComponent {

  componentDidMount () {
    this.props.onExpandHomeTimeline()
  }

  componentDidUpdate (prevProps) {
    //Check if clicked on "home" button, if so, reload
    if (prevProps.location.key !== this.props.location.key &&
        prevProps.location.pathname === '/home' &&
        this.props.location.pathname === '/home') {
      this.handleReload()
    }
  }

  handleLoadMore = (maxId) => {
    this.props.onExpandHomeTimeline({ maxId })
  }

  handleReload = throttle(() => {
    this.props.onExpandHomeTimeline()
  }, 5000)

  render () {
    const { intl } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='home_timeline'
        onLoadMore={this.handleLoadMore}
        timelineId='home'
        emptyMessage={emptyMessage}
      />
    )
  }

}

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
  empty: { id: 'empty_timeline.home', defaultMessage: 'Your home timeline is empty. Start following other users to receive their content here.' },
})

const mapStateToProps = (state) => ({
  isPartial: state.getIn(['timelines', 'home', 'isPartial']),
})

const mapDispatchToProps = (dispatch) => ({
  onExpandHomeTimeline(options) {
    if (!options) dispatch(forceDequeueTimeline('home'))
    dispatch(expandHomeTimeline(options))
  },
})

HomeTimeline.propTypes = {
  intl: PropTypes.object.isRequired,
  isPartial: PropTypes.bool,
  onExpandHomeTimeline: PropTypes.func.isRequired,
}

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeTimeline)))