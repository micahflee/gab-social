import Bundle from './bundle'

class WrappedBundle extends PureComponent {

  render() {
    const {
      component,
      componentParams,
      errorComponent,
      loadingComponent,
    } = this.props

    console.log("WrappedBundle:", this.props)

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