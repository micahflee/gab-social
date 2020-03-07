import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'

export default class Select extends ImmutablePureComponent {

  static propTypes = {
    options: PropTypes.oneOf([
      ImmutablePropTypes.map,
      PropTypes.object,
    ]),
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    const {
      value,
      options,
      onChange
    } = this.props

    return (
      <div className={_s.default}>
        <select
          className={[_s.default, _s.outlineNone, _s.text, _s.border1PX, _s.borderColorSecondary, _s.paddingHorizontal15PX, _s.select].join(' ')}
          value={value}
          onChange={onChange}
        >
          {
            options.map(option => (
              <option key={`option-${option.value}`} value={option.value}>
                {option.title}
              </option>
            ))
          }
        </select>
      </div>
    )
  }

}
