import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearCompose } from '../../actions/compose'
import ComposeFormContainer from './containers/compose_form_container'

class Compose extends React.PureComponent {

  componentWillUnmount() {
    this.props.onClearCompose()
  }

  render () {
    return (
      <div className={[_s.default, _s.bgPrimary, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <ComposeFormContainer isStandalone />
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onClearCompose:() => dispatch(clearCompose())
})

Compose.propTypes = {
  onClearCompose: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(Compose)