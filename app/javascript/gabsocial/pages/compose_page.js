import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import ComposeLayout from '../layouts/compose_layout'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import { getWindowDimension } from '../utils/is_mobile'

const initialState = getWindowDimension()

class ComposePage extends React.PureComponent {

  state = {
    width: initialState.width,
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('keyup', this.handleKeyUp, false)
    window.addEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('resize', this.handleResize, false)
  }

  render() {
    const { children } = this.props
    const { width } = this.state

    const isXS = width <= BREAKPOINT_EXTRA_SMALL
    if (!isXS) throw 'This page does not exist'

    return (
      <ComposeLayout title='Compose' isXS={isXS}>
        <PageTitle path='Compose' />
        {children}
      </ComposeLayout>
    )
  }

}

ComposePage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ComposePage