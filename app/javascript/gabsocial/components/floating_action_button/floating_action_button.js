import ComposeIcon from './assets/compose_icon';

export default class FloatingActionButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.message !== this.props.message;
  }

  render() {
    const { onClick, message } = this.props;

    return (
      <button onClick={onClick} className='floating-action-button' aria-label={message}>
        <ComposeIcon />
      </button>
    )
  }
}