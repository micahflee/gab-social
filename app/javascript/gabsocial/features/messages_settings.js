import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../initial_state'
import { changeChatSetting } from '../actions/chat_settings'
import BlockHeading from '../components/block_heading'
import Form from '../components/form'
import SettingSwitch from '../components/setting_switch'
import Divider from '../components/divider'

class MessagesSettings extends ImmutablePureComponent {

  handleOnChange = (key, checked) => {
    this.props.onSave(key, checked)
  }

  render() {
    const { chatSettings } = this.props

    if (!chatSettings) return null

    return (
      <div className={[_s.d, _s.w100PC, _s.boxShadowNone].join(' ')}>
        <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <BlockHeading title={'Chat Preferences'} />
        </div>

        <div className={[_s.d, _s.px15, _s.py15, _s.overflowHidden].join(' ')}>
          <Form>
            <SettingSwitch
              label="Hide chats from users you don't follow"
              settings={chatSettings}
              settingPath='restrict_non_followers'
              onChange={this.handleOnChange}
            />
            { /* : todo :
            <div className={[_s.d, _s.w100PC, _s.my10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
            <SettingSwitch
              label='Show when you are active'
              settings={chatSettings}
              settingPath='show_active'
              onChange={this.handleOnChange}
            />
            <div className={[_s.d, _s.w100PC, _s.my10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
            <SettingSwitch
              label='Show read receipts'
              settings={chatSettings}
              settingPath='read_receipts'
              onChange={this.handleOnChange}
            />
            <div className={[_s.d, _s.w100PC, _s.my10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
            <SettingSwitch
              label='Notification sound enabled'
              settings={chatSettings}
              settingPath='sounds'
              onChange={this.handleOnChange}
            /> */ }
          </Form>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  chatSettings: state.getIn(['chat_settings']),
})

const mapDispatchToProps = (dispatch) => ({
  onSave(key, checked) {
    // dispatch(changeChatSetting(key, checked))
  },
})

MessagesSettings.propTypes = {
  chatSettings: ImmutablePropTypes.map,
  onSave: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesSettings)