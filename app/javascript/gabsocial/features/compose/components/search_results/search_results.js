import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import TrendingItem from '../../../../components/trends_panel_item';
import Icon from '../../../../components/icon';
import { WhoToFollowPanel } from '../../../../components/panel';
// import TrendsPanel from '../../ui/components/trends_panel';
import GroupListItem from '../../../../components/group_list_item';

export default class SearchResults extends ImmutablePureComponent {

  static propTypes = {
    results: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object,
  };

  state = {
    isSmallScreen: (window.innerWidth <= 895),
  }

  render () {
    const { results, location } = this.props;
    const { isSmallScreen } = this.state;

    if (results.isEmpty() && isSmallScreen) {
      return (
        <div className='search-results'>
          <WhoToFollowPanel />
        </div>
      );
    }

    const pathname = location.pathname || '';
    const showPeople = pathname === '/search/people';
    const showHashtags = pathname === '/search/hashtags';
    const showGroups = pathname === '/search/groups';
    const isTop = !showPeople && !showHashtags && !showGroups;

    let accounts, statuses, hashtags, groups;
    let count = 0;

    if (results.get('accounts') && results.get('accounts').size > 0 && (isTop || showPeople)) {
      const size = isTop ? Math.min(results.get('accounts').size, 5) : results.get('accounts').size;
      count += size;
      accounts = (
        <div className='search-results__section'>
          <h5><Icon id='user' fixedWidth /><FormattedMessage id='search_results.accounts' defaultMessage='People' /></h5>
          {results.get('accounts').slice(0, size).map(accountId => <AccountContainer key={accountId} id={accountId} />)}
        </div>
      );
    }

    if (results.get('groups') && results.get('groups').size > 0 && (isTop || showGroups)) {
      const size = isTop ? Math.min(results.get('groups').size, 5) : results.get('groups').size;
      count += size;
      groups = (
        <div className='search-results__section'>
          <h5><Icon id='users' fixedWidth /><FormattedMessage id='search_results.groups' defaultMessage='Groups' /></h5>
          {results.get('groups').slice(0, size).map(group => <GroupListItem key={`search-${group.get('name')}`} group={group} />)}
        </div>
      );
    }

    if (results.get('hashtags') && results.get('hashtags').size > 0 && (isTop || showHashtags)) {
      const size = isTop ? Math.min(results.get('hashtags').size, 5) : results.get('hashtags').size;
      count += size;
      hashtags = (
        <div className='search-results__section'>
          <h5><Icon id='hashtag' fixedWidth /><FormattedMessage id='search_results.hashtags' defaultMessage='Hashtags' /></h5>
          {results.get('hashtags').slice(0, size).map(hashtag => <TrendingItem key={hashtag.get('name')} hashtag={hashtag} />)}
        </div>
      );
    }

    return (
      <div className='search-results'>
        <div className='search-results__header'>
          <Icon id='search' fixedWidth />
          <FormattedMessage
            id='search_results.total'
            defaultMessage='{count, number} {count, plural, one {result} other {results}}'
            values={{
              count
            }}
          />
        </div>

        {accounts}
        {groups}
        {statuses}
        {hashtags}
      </div>
    );
  }

}
