import StatusContainer from '../containers/status_container'

export default class Status extends PureComponent {
  render() {
    return (
      <StatusContainer {...this.props} />
    )
  }

}
