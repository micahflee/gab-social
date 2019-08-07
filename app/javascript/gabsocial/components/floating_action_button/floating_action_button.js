import './floating_action_button.scss';

export default class FloatingActionButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.message !== this.props.message) {
      return true;
    }

    return false;
  }

  render() {
    const { onClick, message } = this.props;

    return (
      <button onClick={onClick} className='floating-action-button' aria-label={message} />
    )
  }
}