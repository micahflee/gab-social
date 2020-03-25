import { defineMessages, injectIntl } from 'react-intl'
import { fetchSuggestions, dismissSuggestion } from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PanelLayout from './panel_layout'
import Avatar from '../avatar'
import Divider from '../divider'
import Icon from '../icon'
import Heading from '../heading'
import Text from '../text'

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  memberCount: { id: 'lists.panel_members', defaultMessage: 'Members: {count}' },
  createdAt: { id: 'lists.panel_created', defaultMessage: 'Created: {date}' },
  title: { id: 'lists_information', defaultMessage: 'List Information' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
})

const mapStateToProps = state => ({
  // accountIds: state.getIn(['listEditor', 'accounts', 'items']),
})

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListDetailsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  handleShowAllLists() {

  }

  render() {
    const { intl } = this.props

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.edit)}
        headerButtonAction={this.handleShowAllLists}
      >
        <div className={_s.default}>

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter,].join(' ')}>
            <Text weight='medium'>
              Some List Title
            </Text>
          </div>

          <Divider small />

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
            <Icon id='calendar' width='12px' height='12px' className={_s.fillColorSecondary} />
            <Text
              size='small'
              color='secondary'
              className={_s.ml5}
            >
              {
                intl.formatMessage(messages.createdAt, {
                  date: '12-25-2019'
                })
              }
            </Text>
          </div>

          <Divider small />

          <div className={[_s.default].join(' ')}>
            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Icon id='group' width='12px' height='12px' className={_s.fillColorSecondary} />
              <Text
                size='small'
                color='secondary'
                className={_s.ml5}
              >
                {
                  intl.formatMessage(messages.memberCount, {
                    count: 10
                  })
                }
              </Text>
            </div>
            <div className={[_s.default, _s.flexRow, _s.flexWrap, _s.pt10].join(' ')}>

              {
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                  <div className={[_s.default, _s.mr5].join(' ')}>
                    <Avatar size='26' />
                  </div>
                ))
              }
            </div>
          </div>

        </div>
      </PanelLayout>
    )
  }
}