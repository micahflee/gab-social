import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { fetchSuggestions, dismissSuggestion } from '../actions/suggestions'
import HashtagItem from '../components/hashtag_item'
import Icon from '../components/icon'
import { WhoToFollowPanel } from '../components/panel'
// import TrendsPanel from '../ui/components/trends_panel'
import GroupListItem from '../components/group_list_item'
import Block from '../components/block'
import Heading from '../components/heading'
import Button from '../components/button'
import Text from '../components/text'
import Account from '../components/account'
import PanelLayout from '../components/panel/panel_layout'

const mapStateToProps = (state) => ({
  results: state.getIn(['search', 'results']),
  suggestions: state.getIn(['suggestions', 'items']),
});

const mapDispatchToProps = (dispatch) => ({
  fetchSuggestions: () => dispatch(fetchSuggestions()),
  dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
});

export default
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class Search extends ImmutablePureComponent {

  static propTypes = {
    results: ImmutablePropTypes.map.isRequired,
    location: PropTypes.object,
  }

  state = {
    isSmallScreen: (window.innerWidth <= 895),
  }

  render() {
    const { results, location } = this.props
    const { isSmallScreen } = this.state

    console.log("results:", results)

    if (results.isEmpty() && isSmallScreen) {
      return null
    }

    const pathname = location.pathname || ''
    const showPeople = pathname === '/search/people'
    const showHashtags = pathname === '/search/hashtags'
    const showGroups = pathname === '/search/groups'
    const isTop = !showPeople && !showHashtags && !showGroups
    const theLimit = 4

    let accounts, statuses, hashtags, groups
    
    // : todo : statuses

    if (results.get('accounts') && results.get('accounts').size > 0 && (isTop || showPeople)) {
      const size = isTop ? Math.min(results.get('accounts').size, theLimit) : results.get('accounts').size;
      const isMax = size === results.get('accounts').size
      accounts = (
        <PanelLayout
          title='People'
          headerButtonTo={isMax ? undefined : '/search/people'}
          headerButtonTitle={isMax ? undefined : 'See more'}
          footerButtonTo={isMax ? undefined : '/search/people'}
          footerButtonTitle={isMax ? undefined : 'See more'}
          noPadding
        >
          <div className={[_s.default, _s.pb10, _s.px15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <Text color='tertiary' size='small'>
              Showing {size} of {results.get('accounts').size} results
            </Text>
          </div>
          {
            results.get('accounts').slice(0, size).map(accountId => (
              <Account
                compact
                withBio
                key={accountId}
                id={accountId}
              />
            ))
          }
        </PanelLayout>
      )
    }

    if (results.get('groups') && results.get('groups').size > 0 && (isTop || showGroups)) {
      const size = isTop ? Math.min(results.get('groups').size, theLimit) : results.get('groups').size;
      const isMax = size === results.get('groups').size

      groups = (
        <PanelLayout
          title='Groups'
          headerButtonTo={isMax ? undefined : '/search/groups'}
          headerButtonTitle={isMax ? undefined : 'See more'}
          footerButtonTo={isMax ? undefined : '/search/groups'}
          footerButtonTitle={isMax ? undefined : 'See more'}
          noPadding
        >
          <div className={[_s.default, _s.pb10, _s.px15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <Text color='tertiary' size='small'>
              Showing {size} of {results.get('groups').size} results
            </Text>
          </div>
          {
            results.get('groups').slice(0, size).map(group => (
              <GroupListItem
                key={`search-${group.get('name')}`}
                id={group.get('id')}
              />
            ))
          }
        </PanelLayout>
      )
    }

    if (results.get('hashtags') && results.get('hashtags').size > 0 && (isTop || showHashtags)) {
      const size = isTop ? Math.min(results.get('hashtags').size, theLimit) : results.get('hashtags').size;
      const isMax = size === results.get('hashtags').size

      hashtags = (
        <PanelLayout
          title='Hashtags'
          headerButtonTo={isMax ? undefined : '/search/hashtags'}
          headerButtonTitle={isMax ? undefined : 'See more'}
          footerButtonTo={isMax ? undefined : '/search/hashtags'}
          footerButtonTitle={isMax ? undefined : 'See more'}
          noPadding
        >
          <div className={[_s.default, _s.pb10, _s.px15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <Text color='tertiary' size='small'>
              Showing {size} of {results.get('hashtags').size} results
            </Text>
          </div>
          {results.get('hashtags').slice(0, size).map(hashtag => <HashtagItem isCompact key={hashtag.get('name')} hashtag={hashtag} />)}
        </PanelLayout>
      )
    }

    return (
      <div>
        {accounts}
        {groups}
        {statuses}
        {hashtags}
      </div>
    )
  }

}
