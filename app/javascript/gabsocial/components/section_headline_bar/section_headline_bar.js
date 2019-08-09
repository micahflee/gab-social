import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import Icon from '../icon';

class SectionHeadlineBarItem extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    icon: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.node,
    ]),
  };

  render() {
    const { to, title, icon, className, onClick } = this.props;

    const classes = classNames('section-header-bar__item', className);

    if (to) {
      return (<NavLink className={classes} to={to}>{title}</NavLink>);
    } else if (icon) {
      <button className={classes} onClick={onClick} title={title}>
        <Icon id={icon} fixedWidth />
      </button>
    }

    return (<button className={classes} onClick={onClick}>{title}</button>)
  }
};

export default class SectionHeadlineBar extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
  };

  render() {
    const { items } = this.props;

    return (
      <div className='section-headline-bar'>
        {
          items.forEach(item, i => (
            <SectionHeadlineBarItem key={`shbi-{i}`} {...item} />
          ))
        }
      </div>
    )
  }
}