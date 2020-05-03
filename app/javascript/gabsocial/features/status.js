import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchStatus } from '../actions/statuses'
import StatusContainer from '../containers/status_container'
import ColumnIndicator from '../components/column_indicator'

const mapStateToProps = (state, props) => {
  const statusId = props.id || props.params.statusId

  return {
    status: state.getIn(['statuses', statusId]),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchStatus: (id) => dispatch(fetchStatus(id)),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class Status extends ImmutablePureComponent {

  static propTypes = {
    onFetchStatus: PropTypes.func.isRequired,
    params: PropTypes.object,
    status: ImmutablePropTypes.map,
  }

  updateOnProps = [
    'params',
    'status',
  ]

  componentDidMount() {
    const statusId = this.props.id || this.props.params.statusId
    this.props.onFetchStatus(statusId)
  }

  render() {
    const { status } = this.props
    
    // - if comment render as such
    
    if (!status) {
      return <ColumnIndicator type='loading' />
    }

    return (
      <StatusContainer {...this.props} />
    )
  }

}
