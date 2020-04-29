import StatusContainer from '../containers/status_container'

export default class Status extends PureComponent {
  render() {
    console.log("this.props:", this.props)

    return (
      <StatusContainer {...this.props} />
    )
  }

}
