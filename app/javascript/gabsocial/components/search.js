import {
  changeSearch,
  clearSearch,
  submitSearch,
  showSearch,
} from '../actions/search'
import Input from './input'

const mapStateToProps = (state) => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (value) => dispatch(changeSearch(value)),
  onClear: () => dispatch(clearSearch()),
  onSubmit: () => dispatch(submitSearch()),
  onShow: () => dispatch(showSearch()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class Search extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    value: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    onShow: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    withOverlay: PropTypes.bool,
    onClear: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  state = {
    expanded: false,
  }

  textbox = React.createRef()

  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  handleFocus = () => {
    this.setState({ expanded: true })
    this.props.onShow()
  }

  handleBlur = () => {
    this.setState({ expanded: false })
  }

  handleKeyUp = (e) => {
    const { value } = this.props

    if (e.key === 'Enter') {
      e.preventDefault();

      this.props.onSubmit();
      this.context.router.history.push(`/search?q=${value}`);

    } else if (e.key === 'Escape') {
      this.textbox.blur()
    }
  }

  setTextbox = n => {
    this.textbox = n
  }

  render() {
    const {
      value,
      submitted,
      onClear,
      withOverlay
    } = this.props
    const { expanded } = this.state

    const hasValue = value ? value.length > 0 || submitted : 0

    return (
      <div className={[_s.default, _s.justifyContentCenter, _s.height53PX].join(' ')}>
        <Input
          hasClear
          value={value}
          inputRef={this.setTextbox}
          prependIcon='search'
          placeholder='Search on Gab...'
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClear={onClear}
        />

        {
          withOverlay &&
          {/*<Overlay show={expanded && !hasValue} placement='bottom' target={this}>
            <SearchPopout />
        </Overlay>*/}
        }

      </div>
    )
  }

}
