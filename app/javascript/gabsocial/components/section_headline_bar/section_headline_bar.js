import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import Icon from '../icon';

class SectionHeadlineBarItem extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    icon: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    exact: PropTypes.bool,
  };

  render() {
    const { to, title, icon, className, onClick, exact } = this.props;

    const classes = classNames('section-header-bar__item', className);

    if (to) {
      return (
        <NavLink className={classes} exact={exact} to={to}>{title}</NavLink>
      )
    } else if (icon) {
      return (
        <button className={classes} onClick={onClick} title={title}>
          <Icon id={icon} fixedWidth />
        </button>
      )
    }

    return (
      <button className={classes} onClick={onClick}>{title}</button>
    )
  }
};

export default class SectionHeadlineBar extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    className: PropTypes.string,
  };

  render() {
    const { items, className } = this.props;

    const classes = classNames('section-headline-bar', className);

    return (
      <div className={classes}>
        {
          items.forEach((item, i) => (
            <SectionHeadlineBarItem key={`shbi-${i}`} {...item} />
          ))
        }
      </div>
    )
  }
}