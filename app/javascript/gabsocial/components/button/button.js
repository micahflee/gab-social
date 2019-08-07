import classNames from 'classnames';

import './button.scss';

export default class Button extends PureComponent {

  static propTypes = {
    text: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    secondary: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
  };

  handleClick = (e) => {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(e);
    }
  }

  setRef = (c) => {
    this.node = c;
  }

  focus() {
    this.node.focus();
  }

  render () {
    const className = classNames('button', this.props.className, {
      'button--secondary': this.props.secondary,
      'button--block': this.props.block,
    });

    return (
      <button
        className={className}
        disabled={this.props.disabled}
        onClick={this.handleClick}
        ref={this.setRef}
      >
        {this.props.text || this.props.children}
      </button>
    );
  }

}
