import Button from '../button';

export default class ColumnInlineForm extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    btnTitle: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };

  handleChange = e => {
    this.props.onChange(e.target.value);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  }

  handleClick = () => {
    this.props.onSubmit();
  }

  render() {
    const { value, label, btnTitle, disabled } = this.props;

    return (
      <form className='column-inline-form' onSubmit={this.handleSubmit}>
        <label className='column-inline-form__block'>
          <span className='column-inline-form__title'>{label}</span>

          <input
            className='column-inline-form__input'
            value={value}
            disabled={disabled}
            onChange={this.handleChange}
            placeholder={label}
          />
        </label>

        <Button
          className='column-inline-form__btn'
          disabled={disabled}
          onClick={this.handleClick}
        >
          {btnTitle}
        </Button>
      </form>
    );
  }
}