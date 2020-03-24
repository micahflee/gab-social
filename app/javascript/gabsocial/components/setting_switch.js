import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Switch from './switch'

export default class SettingSwitch extends ImmutablePureComponent {

  static propTypes = {
    prefix: PropTypes.string,
    settings: ImmutablePropTypes.map.isRequired,
    settingPath: PropTypes.array.isRequired,
    description: PropTypes.string,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onChange = ({ target }) => {
    this.props.onChange(this.props.settingPath, target.checked)
  }

  render () {
    const {
      prefix,
      settings,
      settingPath,
      label,
      description
    } = this.props

    const id = ['setting-toggle', prefix, ...settingPath].filter(Boolean).join('-')

    return (
      <Switch
        description={description}
        label={label}
        id={id}
        checked={settings.getIn(settingPath)}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

}
