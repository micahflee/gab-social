import { Fragment } from 'react'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import Button from '../button'
import Divider from '../divider'
import Heading from '../heading'
import Icon from '../icon'
import Text from '../text'
import RelativeTimestamp from '../relative_timestamp'

const messages = defineMessages({
  title: { id: 'about', defaultMessage: 'About' },
  members: { id: 'members', defaultMessage: 'Members' },
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

    console.log("group:", group)

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        {
          !!group &&
          <Fragment>

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Text weight='medium'>
                {group.get('title')}
              </Text>
            </div>

            <Divider isSmall />

            <div className={[_s.default, _s.flexRow, _s.justifyContentCenter].join(' ')}>
              <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                <Icon id='group' size='14px' />
                <Text size='small' className={_s.ml5}>
                  {intl.formatMessage(messages.members)}
                </Text>
              </div>
              <Button
                isText
                to={`/groups/${group.get('id')}/members`}
                color='brand'
                backgroundColor='none'
                className={_s.mlAuto}
              >
                <Text color='inherit' weight='medium' size='normal' className={_s.underline_onHover}>
                  {shortNumberFormat(group.get('member_count'))}
                  &nbsp;
                  {intl.formatMessage(messages.members)}
                </Text>
              </Button>
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
                    date: <RelativeTimestamp timestamp={group.get('created_at')} />,
                  }} />
                }
              </Text>
            </div>

            <Divider isSmall />

            <Text>
              {group.get('description')}
            </Text>
          </Fragment>
        }
      </PanelLayout>
    )
  }
}