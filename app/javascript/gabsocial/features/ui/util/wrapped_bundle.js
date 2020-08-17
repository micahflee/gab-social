import React from 'react'
import PropTypes from 'prop-types'
import Bundle from './bundle'

class WrappedBundle extends React.PureComponent {

  render() {
    const {
      component,
      componentParams,
      errorComponent,
      loadingComponent,
    } = this.props

    return (
      <Bundle
        fetchComponent={component}
        loading={loadingComponent}
        error={errorComponent}
      >
        {
          Component =>
          (
            <Component {...componentParams} />
          )
        }
      </Bundle>
    )
  }

}

WrappedBundle.propTypes = {
  component: PropTypes.func.isRequired,
  componentParams: PropTypes.object,
  errorComponent: PropTypes.object,
  loadingComponent: PropTypes.object,
}

export default WrappedBundle