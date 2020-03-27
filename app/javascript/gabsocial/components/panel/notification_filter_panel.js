import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import Button from '../button'
import Divider from '../divider'
import Heading from '../heading'
import Icon from '../icon'
import Input from '../input'
import Switch from '../switch'
import Text from '../text'

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

    // date
    // verfied or not
    // specific user
    // specific status
    // only people i do/not follow

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <Text>Start Date</Text>
        <Text>End Date</Text>

        <Divider small />

        <Input title='From specific user(s)' small />

        <Input title='From a specific status' small />

        <Divider small />

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