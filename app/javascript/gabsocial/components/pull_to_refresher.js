import React from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import PullToRefresh from 'pulltorefreshjs'
import moment from 'moment-mini'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import { getWindowDimension } from '../utils/is_mobile'
import Responsive from '../features/ui//util/responsive_component'
import Text from './text'

const initialState = getWindowDimension()

class PullToRefresher extends React.PureComponent {

  state = {
    lastRefreshDate: null,
    width: initialState.width,
  }

  componentDidMount() {
    this.handleDestroy()
    
    // : TODO : optimize
    return
    
    if (this.props.isDisabled) return
    if (this.state.width > BREAKPOINT_EXTRA_SMALL) return

    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)

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
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
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

PullToRefresher.propTypes = {
  onRefresh: PropTypes.func,
  isDisabled: PropTypes.bool,
}

export default PullToRefresher