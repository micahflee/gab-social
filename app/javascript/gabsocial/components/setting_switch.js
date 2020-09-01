import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Switch from './switch'

class SettingSwitch extends ImmutablePureComponent {

  updateOnProps = [
    'prefix',
    'settings',
    'settingPath',
    'description',
    'label',
  ]

  onChange = (checked) => {
    this.props.onChange(this.props.settingPath, checked)
  }

  render () {
    const {
      prefix,
      settings,
      settingPath,
      label,
      description
    } = this.props

    const isArray = Array.isArray(settingPath)
    const checked = isArray ? settings.getIn(settingPath) : settings.get(settingPath)
    const idVal = isArray ? settingPath.join('-') : settingPath
    const id = ['setting-toggle', prefix, idVal].filter(Boolean).join('-')
  
    return (
      <Switch
        description={description}
        label={label}
        id={id}
        checked={checked}
        onChange={this.onChange}
      />
    )
  }

}

SettingSwitch.propTypes = {
  prefix: PropTypes.string,
  settings: ImmutablePropTypes.map.isRequired,
  settingPath: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default SettingSwitch