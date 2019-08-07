import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import SettingToggle from '../../../components/setting_toggle';
import { changeSetting, saveSettings } from '../../../actions/settings';

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
@injectIntl
class ColumnSettings extends PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { settings, onChange } = this.props;

    return (
      <div>
        <span className='column-settings__section'><FormattedMessage id='home.column_settings.basic' defaultMessage='Basic' /></span>

        <div className='column-settings__row'>
          <SettingToggle
            prefix='home_timeline'
            settings={settings}
            settingPath={['shows', 'reblog']}
            onChange={onChange}
            label={<FormattedMessage id='home.column_settings.show_reblogs' defaultMessage='Show reposts' />}
          />
        </div>

        <div className='column-settings__row'>
          <SettingToggle
            prefix='home_timeline'
            settings={settings}
            settingPath={['shows', 'reply']}
            onChange={onChange}
            label={<FormattedMessage id='home.column_settings.show_replies' defaultMessage='Show replies' />}
          />
        </div>
      </div>
    );
  }

}
