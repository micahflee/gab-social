import ImmutablePropTypes from 'react-immutable-proptypes';
import ToggleSwitch from '../toggle_switch';

import './setting_toggle.scss';

export default class SettingToggle extends PureComponent {

  static propTypes = {
    prefix: PropTypes.string,
    settings: ImmutablePropTypes.map.isRequired,
    settingPath: PropTypes.array.isRequired,
    label: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onChange = ({ target }) => {
    this.props.onChange(this.props.settingPath, target.checked);
  }

  render () {
    const { prefix, settings, settingPath, label } = this.props;
    const id = ['setting-toggle', prefix, ...settingPath].filter(Boolean).join('-');

    return (
      <div className='setting-toggle'>
        <ToggleSwitch id={id} checked={settings.getIn(settingPath)} onChange={this.onChange} onKeyDown={this.onKeyDown} />
        <label htmlFor={id} className='setting-toggle__label'>{label}</label>
      </div>
    );
  }

}