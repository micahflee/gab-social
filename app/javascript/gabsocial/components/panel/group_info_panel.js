import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../../initial_state'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import UserStat from '../user_stat'

const messages = defineMessages({
  title: { id: 'about', defaultMessage: 'About' },
})

export default
@injectIntl
class GroupInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl, group } = this.props

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        
      </PanelLayout>
    )
  }
}