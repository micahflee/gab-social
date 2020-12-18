import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import { clearCompose, changeCompose } from '../../actions/compose'
import ComposeFormContainer from './containers/compose_form_container'

class Compose extends React.PureComponent {

  componentDidMount() {
    const search = this.context.router.route.location.search
    try {
      const qp = queryString.parse(search)
      const url = `${qp.url || ''}`
      const text = `${qp.text || ''}`

      if (url.length > 0 || text.length > 0) {
        let value = ""
        if (text.length > 0) value += `${text} `
        if (url.length > 0) value += url
        this.props.dispatch(changeCompose(value))
      }
    } catch (error) {
      // 
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearCompose())
  }

  render () {
    return <ComposeFormContainer formLocation='standalone' />
  }

}

Compose.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default withRouter(connect()(Compose))