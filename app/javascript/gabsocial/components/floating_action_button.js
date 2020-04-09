import Button from './button'

export default class FloatingActionButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.message !== this.props.message;
  }

  render() {
    const { onClick, message } = this.props;

    // const shouldHideFAB = path => path.match(/^\/posts\/|^\/search|^\/getting-started/);
    // const floatingActionButton = shouldHideFAB(this.context.router.history.location.pathname) ? null : <button key='floating-action-button' onClick={this.handleOpenComposeModal} className='floating-action-button' aria-label={intl.formatMessage(messages.publish)}></button>;

    return (
      <Button
        onClick={onClick}
        color='white'
        backgroundColor='brand'
        className={[_s.positionFixed, _s.z4, _s.py15, _s.mb15, _s.mr15, _s.bottom0, _s.right0].join(' ')}
        title={message}
        aria-label={message}
        icon='pencil'
      />
    )
  }
}