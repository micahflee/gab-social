import Button from './button'

export default class FloatingActionButton extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.message !== this.props.message
  }

  render() {
    const { onClick, message } = this.props

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