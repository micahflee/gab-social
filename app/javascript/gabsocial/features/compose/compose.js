import React from 'react'
import { clearCompose } from '../../actions/compose'
import ComposeFormContainer from './containers/compose_form_container'

const mapDispatchToProps = (dispatch) => ({
  onClearCompose:() => dispatch(clearCompose())
})

export default
@connect(null, mapDispatchToProps)
class Compose extends React.PureComponent {

  static propTypes = {
    onClearCompose: PropTypes.func.isRequired,
  }

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
