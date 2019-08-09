import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { changeSetting, saveSettings } from '../../../../actions/settings';
import SettingToggle from '../../../../components/setting_toggle';
import ColumnSettingsHeading from '../../../../components/column_settings_heading';

const mapStateToProps = state => ({
  settings: state.getIn(['settings', 'home']),
});

const mapDispatchToProps = dispatch => ({
  onChange(key, checked) {
    dispatch(changeSetting(['home', ...key], checked));
  },
  onSave() {
    dispatch(saveSettings());
  },
});

export default @connect(mapStateToProps, mapDispatchToProps)
class ColumnSettings extends PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render () {
    const { settings, onChange } = this.props;

    return (
      <div>
        <ColumnSettingsHeading
          heading={<FormattedMessage id='home.column_settings.basic' defaultMessage='Basic' />}
        />

        <SettingToggle
          prefix='home_timeline'
          settings={settings}
          settingPath={['shows', 'reblog']}
          onChange={onChange}
          label={<FormattedMessage id='home.column_settings.show_reblogs' defaultMessage='Show reposts' />}
        />

        <SettingToggle
          prefix='home_timeline'
          settings={settings}
          settingPath={['shows', 'reply']}
          onChange={onChange}
          label={<FormattedMessage id='home.column_settings.show_replies' defaultMessage='Show replies' />}
        />
      </div>
    );
  }

}
