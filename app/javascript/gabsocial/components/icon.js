import classNames from 'classnames';

export default class Icon extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    fixedWidth: PropTypes.bool,
  };

  render () {
    const { id, className, fixedWidth, ...other } = this.props;

    return (
      <i role='img' alt={id} className={classNames('fa', `fa-${id}`, className, { 'fa-fw': fixedWidth })} {...other} />
    );
  }

}
