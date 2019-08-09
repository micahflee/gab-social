import { defineMessages, injectIntl } from 'react-intl';
import SectionHeadlineBar from '../../../../components/section_headline_bar';

const tooltips = defineMessages({
  mentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
  favourites: { id: 'notifications.filter.favourites', defaultMessage: 'Favorites' },
  boosts: { id: 'notifications.filter.boosts', defaultMessage: 'Reposts' },
  polls: { id: 'notifications.filter.polls', defaultMessage: 'Poll results' },
  follows: { id: 'notifications.filter.follows', defaultMessage: 'Follows' },
  filterAll: { id: 'notifications.filter.all', defaultMessage: 'All' },
  filterMentions: { id: 'notifications.filter.mentions', defaultMessage: 'Mentions' },
});

export default @injectIntl
class NotificationFilterBar extends PureComponent {

  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    advancedMode: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
  };

  onClick (notificationType) {
    return () => this.props.selectFilter(notificationType);
  }

  render () {
    const { selectedFilter, advancedMode, intl } = this.props;

    if (!advancedMode) {
      return (
        <SectionHeadlineBar
          items={[
            {
              className: selectedFilter === 'all' ? 'active' : '',
              onClick: this.onClick('all'),
              title: intl.formatMessage(messages.filterAll),
            },
            {
              className: selectedFilter === 'mention' ? 'active' : '',
              onClick: this.onClick('mention'),
              title: intl.formatMessage(messages.filterMentions),
            }
          ]}
        />
      )
    }

    return (
      <SectionHeadlineBar
        items={[
          {
            className: selectedFilter === 'all' ? 'active' : '',
            onClick: this.onClick('all'),
            title: intl.formatMessage(messages.filterAll),
          },
          {
            className: selectedFilter === 'mention' ? 'active' : '',
            onClick: this.onClick('mention'),
            title: intl.formatMessage(tooltips.mentions),
            icon: 'at',
          },
          {
            className: selectedFilter === 'favourite' ? 'active' : '',
            onClick: this.onClick('favourite'),
            title: intl.formatMessage(tooltips.favourites),
            icon: 'star',
          },
          {
            className: selectedFilter === 'reblog' ? 'active' : '',
            onClick: this.onClick('reblog'),
            title: intl.formatMessage(tooltips.boosts),
            icon: 'retweet',
          },
          {
            className: selectedFilter === 'poll' ? 'active' : '',
            onClick: this.onClick('poll'),
            title: intl.formatMessage(tooltips.polls),
            icon: 'tasks',
          },
          {
            className: selectedFilter === 'follow' ? 'active' : '',
            onClick: this.onClick('follow'),
            title: intl.formatMessage(tooltips.follows),
            icon: 'user-plus',
          }
        ]}
      />
    )
  }

}
