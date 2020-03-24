import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import ColumnHeaderSettingButton from '../../../../components/column_header_setting_button';
import SettingSwitch from '../../../../components/setting_switch';

export default class ColumnSettings extends ImmutablePureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    pushSettings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  onPushChange = (path, checked) => {
    this.props.onChange(['push', ...path], checked);
  }

  render() {
    const { settings, pushSettings, onChange, onClear } = this.props;

    const filterShowStr = <FormattedMessage id='notifications.column_settings.filter_bar.show' defaultMessage='Show' />;
    const filterAdvancedStr = <FormattedMessage id='notifications.column_settings.filter_bar.advanced' defaultMessage='Display all categories' />;
    const alertStr = <FormattedMessage id='notifications.column_settings.alert' defaultMessage='Desktop notifications' />;
    const showStr = <FormattedMessage id='notifications.column_settings.show' defaultMessage='Show in column' />;
    const soundStr = <FormattedMessage id='notifications.column_settings.sound' defaultMessage='Play sound' />;

    const showPushSettings = pushSettings.get('browserSupport') && pushSettings.get('isSubscribed');
    const pushStr = showPushSettings && <FormattedMessage id='notifications.column_settings.push' defaultMessage='Push notifications' />;

    return (
      <div>
        <ColumnHeaderSettingButton
          onClick={onClear}
          title={<FormattedMessage id='notifications.clear' defaultMessage='Clear notifications' />}
          icon='eraser'
        />

        <div role='group' aria-labelledby='notifications-filter-bar'>
          <FormattedMessage id='notifications.column_settings.filter_bar.category' defaultMessage='Quick filter bar' />
          <SettingSwitch id='show-filter-bar' prefix='notifications' settings={settings} settingPath={['quickFilter', 'show']} onChange={onChange} label={filterShowStr} />
          <SettingSwitch id='show-filter-bar' prefix='notifications' settings={settings} settingPath={['quickFilter', 'advanced']} onChange={onChange} label={filterAdvancedStr} />
        </div>

        <div role='group' aria-labelledby='notifications-follow'>
          <FormattedMessage id='notifications.column_settings.follow' defaultMessage='New followers:' />
          <SettingSwitch prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'follow']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingSwitch prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'follow']} onChange={this.onPushChange} label={pushStr} />}
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['shows', 'follow']} onChange={onChange} label={showStr} />
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['sounds', 'follow']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-favorite'>
          <FormattedMessage id='notifications.column_settings.favorite' defaultMessage='Favorites:' />
          <SettingSwitch prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'favorite']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingSwitch prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'favorite']} onChange={this.onPushChange} label={pushStr} />}
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['shows', 'favorite']} onChange={onChange} label={showStr} />
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['sounds', 'favorite']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-mention'>
          <FormattedMessage id='notifications.column_settings.mention' defaultMessage='Mentions:' />
          <SettingSwitch prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'mention']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingSwitch prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'mention']} onChange={this.onPushChange} label={pushStr} />}
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['shows', 'mention']} onChange={onChange} label={showStr} />
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['sounds', 'mention']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-repost'>
          <FormattedMessage id='notifications.column_settings.repost' defaultMessage='Reposts:' />
          <SettingSwitch prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'repost']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingSwitch prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'repost']} onChange={this.onPushChange} label={pushStr} />}
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['shows', 'repost']} onChange={onChange} label={showStr} />
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['sounds', 'repost']} onChange={onChange} label={soundStr} />
        </div>

        <div role='group' aria-labelledby='notifications-poll'>
          <FormattedMessage id='notifications.column_settings.poll' defaultMessage='Poll results:' />
          <SettingSwitch prefix='notifications_desktop' settings={settings} settingPath={['alerts', 'poll']} onChange={onChange} label={alertStr} />
          {showPushSettings && <SettingSwitch prefix='notifications_push' settings={pushSettings} settingPath={['alerts', 'poll']} onChange={this.onPushChange} label={pushStr} />}
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['shows', 'poll']} onChange={onChange} label={showStr} />
          <SettingSwitch prefix='notifications' settings={settings} settingPath={['sounds', 'poll']} onChange={onChange} label={soundStr} />
        </div>
      </div>
    );
  }

}
