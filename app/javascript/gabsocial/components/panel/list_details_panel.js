import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PanelLayout from './panel_layout'
import Divider from '../divider'
import Icon from '../icon'
import RelativeTimestamp from '../relative_timestamp'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'lists_information', defaultMessage: 'List Information' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
})

export default
@injectIntl
class ListDetailsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    list: ImmutablePropTypes.map,
  }

  handleOnEdit = () => {
    this.props.onEdit()
  }

  render() {
    const { intl, list } = this.props

    const title = !!list ? list.get('title') : ''
    const createdAt = !!list ? list.get('created_at') : ''

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.edit)}
        headerButtonAction={this.handleOnEdit}
      >
        <div className={_s.default}>

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
            <Text weight='medium'>
              {title}
            </Text>
          </div>

          <Divider isSmall />

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
            <Icon id='calendar' size='12px' className={_s.fillSecondary} />
            <Text
              size='small'
              color='secondary'
              className={_s.ml5}
            >
              {
                <FormattedMessage id='lists.panel_created' defaultMessage='Created: {date}' values={{
                  date: <RelativeTimestamp timestamp={createdAt} />,
                }} />
              }
            </Text>
          </div>

        </div>
      </PanelLayout>
    )
  }
}