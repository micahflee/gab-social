import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Icon from '../icon';

export default class ColumnHeaderSettingButton extends PureComponent {

  static propTypes = {
    title: PropTypes.node.isRequired,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    to: PropTypes.string,
  };

  render () {
    const { title, icon, to, onClick } = this.props;

    const classes = classNames('column-header-setting-btn', {
      'column-header-setting-btn--link': !!to
    });

    if (to) {
      return (
        <Link to={to} className={classes}>
          {title}
          <Icon id={icon} />
        </Link>
      )
    }

    return (
      <button className={classes} tabIndex='0' onClick={onClick}>
        <Icon id={icon} />
        {title}
      </button>
    );
  }

}
