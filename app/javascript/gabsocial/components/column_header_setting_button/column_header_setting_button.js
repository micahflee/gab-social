import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Icon from '../icon';

import './column_header_setting_button.scss';

export default class ColumnHeaderSettingButton extends PureComponent {

  static propTypes = {
    title: PropTypes.node.isRequired,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    to: PropTypes.string,
  };

  render () {
    const { title, icon, to } = this.props;

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
      <button className={classes} tabIndex='0' onClick={this.props.onClick}>
        <Icon id={icon} />
        {title}
      </button>
    );
  }

}
