import { shortNumberFormat } from '../../utils/numbers';

import './index.scss';

const mapStateToProps = state => ({
  count: state.getIn(['notifications', 'unread']),
});

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

export default connect(mapStateToProps)(NotificationCounter);