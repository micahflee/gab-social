import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchLatestFromGabTimeline } from '../../actions/news'
import PanelLayout from './panel_layout'
import StatusContainer from '../../containers/status_container'

class LatestFromGabPanel extends ImmutablePureComponent {

  state = {
    fetched: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched && this.props.isLazy) {
      this.props.dispatch(fetchLatestFromGabTimeline())
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.dispatch(fetchLatestFromGabTimeline())
      this.setState({ fetched: true })
    }
  }

  render() {
    const { items } = this.props
    const { fetched } = this.state
  
    const count = !!items ? items.count() : 0
    if (count === 0 && fetched) return null

    return (
      <PanelLayout
        noPadding
        title='Latest from @Gab'
        headerButtonTo='/gab'
        headerButtonTitle='Go to @gab'
      >
        {
          items.map((statusId, i) => (
            <div
              className={[_s.d, _s.w100PC, _s.px15, _s.pt5, _s.pb10].join(' ')}
              key={`latest-from-gab-status-${i}`}
            >
              <StatusContainer
                id={statusId}
                isChild
              />
            </div>
          ))
        }
      </PanelLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  items: state.getIn(['news', 'latest_from_gab', 'items']),
})

LatestFromGabPanel.propTypes = {
  //
}

export default connect(mapStateToProps)(LatestFromGabPanel)