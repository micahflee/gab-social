import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearCompose } from '../../actions/compose'
import ComposeFormContainer from './containers/compose_form_container'

class Compose extends React.PureComponent {

  componentWillUnmount() {
    this.props.dispatch(clearCompose())
  }

  render () {
    return <ComposeFormContainer formLocation='standalone' />
  }

}

export default connect()(Compose)