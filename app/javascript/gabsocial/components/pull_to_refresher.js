import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PullToRefresh from 'pulltorefreshjs'
import moment from 'moment-mini'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Responsive from '../features/ui//util/responsive_component'
import Text from './text'

class PullToRefresher extends React.PureComponent {

  state = {
    lastRefreshDate: null,
  }

  componentDidMount() {
    this.handleDestroy()
    
    // : TODO : optimize
    return
    
    if (this.props.isDisabled) return
    if (this.props.width > BREAKPOINT_EXTRA_SMALL) return

    const textProps = {
      color: 'secondary',
      weight: 'medium',
      size: 'medium',
      className: [_s.py10].join(' ')
    }

    const ptr = PullToRefresh.init({
      mainElement: 'body',
      distMax: 130,
      onRefresh: this.handleOnRefresh,
      instructionsPullToRefresh: ReactDOMServer.renderToString(
        <Text {...textProps}>Pull to Refresh</Text>
      ),
      instructionsReleaseToRefresh: ReactDOMServer.renderToString(
        <Text {...textProps}>Release to Refresh</Text>
      ),
      instructionsRefreshing: ReactDOMServer.renderToString(
        <Text {...textProps}>Refreshing</Text>
      ),
    })
  }

  componentWillUnmount() {
    this.handleDestroy()
  }

  handleDestroy() {
    PullToRefresh.destroyAll()
  }

  handleOnRefresh = () => {
    const { lastRefreshDate } = this.state

    if (!lastRefreshDate) {
      this.props.onRefresh()
      this.setState({ lastRefreshDate: new Date() })
    } else {
      const diff = moment().diff(lastRefreshDate, 'seconds')
      if (diff > 10) {
        this.props.onRefresh()
        this.setState({ lastRefreshDate: new Date() })
      }
    }
  }

  render() {
    const { isDisabled } = this.props

    if (isDisabled) return null

    return <div/>
  }

}

const mapStateToProps = (state) => ({
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})
  
PullToRefresher.propTypes = {
  onRefresh: PropTypes.func,
  isDisabled: PropTypes.bool,
}

export default connect(mapStateToProps)(PullToRefresher)