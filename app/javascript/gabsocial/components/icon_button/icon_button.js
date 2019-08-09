import classNames from 'classnames';
import spring from 'react-motion/lib/spring';
import Motion from '../../features/ui/util/optional_motion';
import Icon from '../icon';

import './icon_button.scss';

export default class IconButton extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    size: PropTypes.number,
    active: PropTypes.bool,
    pressed: PropTypes.bool,
    expanded: PropTypes.bool,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    inverted: PropTypes.bool,
    animate: PropTypes.bool,
    overlay: PropTypes.bool,
    tabIndex: PropTypes.string,
    text: PropTypes.string,
  };

  static defaultProps = {
    size: 18,
    active: false,
    disabled: false,
    animate: false,
    overlay: false,
    tabIndex: '0',
  };

  handleClick = (e) =>  {
    e.preventDefault();

    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  }

  render () {
    const style = {
      fontSize: `${this.props.size}px`,
      width: `${this.props.size * 1.28571429}px`,
      height: `${this.props.size * 1.28571429}px`,
      lineHeight: `${this.props.size}px`,
      ...this.props.style,
    };

    const {
      active,
      animate,
      className,
      disabled,
      expanded,
      icon,
      inverted,
      overlay,
      pressed,
      tabIndex,
      title,
      text,
    } = this.props;

    const classes = classNames(className, 'icon-button', {
      active,
      disabled,
      inverted,
      overlayed: overlay,
    });

    // Perf optimization: avoid unnecessary <Motion> components unless we actually need to animate.
    if (!animate) {
      return (
        <button
          aria-label={title}
          aria-pressed={pressed}
          aria-expanded={expanded}
          title={title}
          className={classes}
          onClick={this.handleClick}
          style={style}
          tabIndex={tabIndex}
          disabled={disabled}
        >
          <Icon id={icon} fixedWidth aria-hidden='true' />
          {!!text && text}
        </button>
      );
    }

    return (
      <Motion defaultStyle={{ rotate: active ? -360 : 0 }} style={{ rotate: animate ? spring(active ? -360 : 0, { stiffness: 120, damping: 7 }) : 0 }}>
        {({ rotate }) => (
          <button
            aria-label={title}
            aria-pressed={pressed}
            aria-expanded={expanded}
            title={title}
            className={classes}
            onClick={this.handleClick}
            style={style}
            tabIndex={tabIndex}
            disabled={disabled}
          >
            <Icon id={icon} style={{ transform: `rotate(${rotate}deg)` }} fixedWidth aria-hidden='true' />
            {!!text && text}
          </button>
        )}
      </Motion>
    );
  }

}
