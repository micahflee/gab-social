import { shortNumberFormat } from '../../utils/numbers';

const mapStateToProps = state => ({
  count: state.getIn(['notifications', 'unread']),
});

export default
@connect(mapStateToProps)
class NotificationCounter extends PureComponent {

	static propTypes = {
	  count: PropTypes.number.isRequired,
	};

	render() {
	  const { count } = this.props;

	  if (count < 1) return null;

	  return (
	    <span className='notification-counter'>{shortNumberFormat(count)}</span>
	  );
	}

}