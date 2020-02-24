import Icon from './icon'
import Button from './button'

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
      <Button onClick={onClick} className='floating-action-button' aria-label={message}>
        <Icon id='compose' />
      </Button>
    )
  }
}