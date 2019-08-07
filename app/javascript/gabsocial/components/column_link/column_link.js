import { Link } from 'react-router-dom';
import Icon from '../../components/icon';

export default class ColumnLink extends PureComponent {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    to: PropTypes.string,
  };

  render() {
    const { to, icon, text } = this.props;

    return (
      <Link to={to} className='column-link'>
        <Icon id={icon} fixedWidth className='column-link__icon' />
        {text}
      </Link>
    );
  }
};
