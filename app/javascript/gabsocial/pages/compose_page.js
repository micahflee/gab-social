import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PageTitle from '../features/ui/util/page_title'
import ComposeLayout from '../layouts/compose_layout'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'

class ComposePage extends React.PureComponent {

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp, false)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  render() {
    const { children, width } = this.props

    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    return (
      <ComposeLayout title='Compose' isXS={isXS}>
        <PageTitle path='Compose' />
        {children}
      </ComposeLayout>
    )
  }

}

const mapStateToProps = (state) => ({
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})

ComposePage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default connect(mapStateToProps)(ComposePage)