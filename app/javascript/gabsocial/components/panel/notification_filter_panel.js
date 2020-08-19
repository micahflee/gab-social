import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../../initial_state'
import { setFilter } from '../../actions/notifications'
import PanelLayout from './panel_layout'
import SettingSwitch from '../setting_switch'

class NotificationFilterPanel extends ImmutablePureComponent {

  render() {
    const {
      intl,
      onChange,
      settings,
      isPro
    } = this.props

    if (!isPro) return null

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <SettingSwitch
          prefix='notification'
          settings={settings}
          settingPath={'onlyVerified'}
          onChange={onChange}
          label={intl.formatMessage(messages.onlyVerified)}
        />

        { /* : todo :
          <SettingSwitch
          prefix='notification'
          settings={settings}
          settingPath={'onlyFollowing'}
          onChange={onChange}
          label={intl.formatMessage(messages.onlyFollowing)}
        /> */ }
      </PanelLayout>
    )
  }
}

const messages = defineMessages({
  title: { id: 'notification_filters', defaultMessage: 'Notification Filters' },
  onlyVerified: { id: 'notification_only_verified', defaultMessage: 'Only Verified Users' },
  // onlyFollowing: { id: 'notification_only_following', defaultMessage: 'Only People I Follow' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['notifications', 'filter']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange(path, value) {
    dispatch(setFilter(path, value))
  },
})

NotificationFilterPanel.propTypes = {
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  settings: ImmutablePropTypes.map.isRequired,
  isPro: PropTypes.bool.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(NotificationFilterPanel))