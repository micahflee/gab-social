import classNames from 'classnames';

export default class Permalink extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    children: PropTypes.node,
    blank: PropTypes.bool,
    button: PropTypes.bool,
  };

  handleClick = e => {
    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(this.props.href);
    }
  }

  render () {
    const { href, children, className, blank, ...other } = this.props;

    const classes = classNames('permalink', className);
    const target = blank ? '_blank' : null;

    return (
      <a target={target} href={href} onClick={this.handleClick} className={classes} {...other}>
        {children}
      </a>
    );
  }

}
