import classNames from 'classnames/bind'
import Overlay from 'react-overlays/lib/Overlay'
import {
  changeSearch,
  clearSearch,
  submitSearch,
  showSearch,
} from '../actions/search'
import SearchPopout from './search_popout'
import Input from './input'

const mapStateToProps = state => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
})

const mapDispatchToProps = dispatch => ({

  onChange (value) {
    dispatch(changeSearch(value))
  },

  onClear () {
    dispatch(clearSearch())
  },

  onSubmit () {
    dispatch(submitSearch())
  },

  onShow () {
    dispatch(showSearch())
  },

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
    openInRoute: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    withOverlay: PropTypes.bool,
    handleClear: PropTypes.func.isRequired,
  }

  state = {
    expanded: false,
  }

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

  render() {
    const { value, submitted, onKeyUp, handleClear, handleSubmit, withOverlay } = this.props
    const { expanded } = this.state

    const hasValue = value ? value.length > 0 || submitted : 0

    return (
      <div className={[_s.default, _s.justifyContentCenter, _s.height53PX].join(' ')}>
        <Input
          hasClear
          value={value}
          prependIcon='search'
          placeholder='Search on Gab...'
          onChange={this.handleChange}
          onKeyUp={onKeyUp}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClear={handleClear}
        />

        {
          withOverlay &&
          <Overlay show={expanded && !hasValue} placement='bottom' target={this}>
            <SearchPopout />
          </Overlay>
        }

      </div>
    )
  }

}
