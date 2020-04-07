import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { changeSetting, saveSettings } from '../../actions/settings'
import PanelLayout from './panel_layout'
import SettingSwitch from '../setting_switch'

const messages = defineMessages({
  title: { id: 'notification_filters', defaultMessage: 'Notification Filters' },
  onlyVerified: { id: 'notification_only_verified', defaultMessage: 'Only Verified Users' },
  onlyFollowing: { id: 'notification_only_following', defaultMessage: 'Only People I Follow' },
})

const mapStateToProps = state => ({
  settings: state.getIn(['settings', 'notifications']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(key, checked) {
      dispatch(changeSetting(['notifications', ...key], checked))
      dispatch(saveSettings())
    },
  }
}

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class NotificationFilterPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { intl, onChange, settings } = this.props

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <SettingSwitch
          prefix='notification'
          settings={settings}
          settingPath={['quickFilter', 'onlyVerifed']}
          onChange={onChange}
          label={intl.formatMessage(messages.onlyVerified)}
        />

        <SettingSwitch
          prefix='notification'
          settings={settings}
          settingPath={['quickFilter', 'onlyFollowing']}
          onChange={onChange}
          label={intl.formatMessage(messages.onlyFollowing)}
        />
      </PanelLayout>
    )
  }
}