import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import PanelLayout from './panel_layout'
import Switch from '../switch'

const messages = defineMessages({
  title: { id: 'notification_filters', defaultMessage: 'Notification Filters' },
})

export default
@injectIntl
class NotificationFilterPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl } = this.props

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <Switch 
          id='notifications-verified'
          label='Only Verified Users'
        />
        
        <Switch 
          id='notifications-verified'
          label='Only People I Follow'
        />
      </PanelLayout>
    )
  }
}