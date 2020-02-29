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
import Text from '../text'

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

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        {
          !!group &&
          <Fragment>

            <Heading size='h3'>
              {group.get('title')}
            </Heading>

            <Divider small />

            <div className={[_s.default, _s.flexRow, _s.justifyContentCenter].join(' ')}>
              <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                <Icon id='group' height='14px' width='14px' />
                <Text size='small' className={_s.marginLeft5PX}>
                  {intl.formatMessage(messages.members)}
                </Text>
              </div>
              <Button
                text
                to={`/groups/${group.get('id')}/members`}
                color='brand'
                backgroundColor='none'
                className={_s.marginLeftAuto}
              >
                <Text color='inherit' weight='medium' size='normal' className={_s.underline_onHover}>
                  {shortNumberFormat(group.get('member_count'))}
                  &nbsp;
                  {intl.formatMessage(messages.members)}
                </Text>
              </Button>
            </div>

            <Divider small />

            <Text>
              {group.get('description')}
            </Text>
          </Fragment>
        }
      </PanelLayout>
    )
  }
}