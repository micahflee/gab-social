import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  sortableContainer,
  sortableElement,
} from 'react-sortable-hoc'
import { me, meUsername} from '../initial_state'
import {
  GAB_DECK_MAX_ITEMS,
  URL_GAB_PRO,
  MODAL_PRO_UPGRADE,
} from '../constants'
import {
  deckConnect,
  deckDisconnect,
  updateDeckColumnAtIndex,
} from '../actions/deck'
import { saveSettings } from '../actions/settings'
import { openModal } from '../actions/modal'
import WrappedBundle from './ui/util/wrapped_bundle'
import DeckColumn from '../components/deck_column'
import Text from '../components/text'
import Button from '../components/button'
import {
  AccountTimeline,
  Compose,
  GroupTimeline,
  LikedStatuses,
  ListTimeline,
  HomeTimeline,
  Notifications,
  HashtagTimeline,
  BookmarkedStatuses,
  ProTimeline,
  News,
  ExploreTimeline,
} from './ui/util/async_components'

class Deck extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount () {
    this.props.dispatch(deckConnect())
    if (!this.props.isPro) this.handleOnOpenProUpgradeModal()
  }

  componentWillUnmount() {
    this.props.dispatch(deckDisconnect())
  }

  handleOnOpenProUpgradeModal = () => {
    this.props.dispatch(openModal(MODAL_PRO_UPGRADE))
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.props.dispatch(updateDeckColumnAtIndex(oldIndex, newIndex))
  }

  onShouldCancelStart = (event) => {
    if (event.target) {
      if (!event.target.hasAttribute('data-sort-header')) {
        return true
      }
    }

    return false
  }

  getDeckColumn = (deckColumn, index) => {
    if (!deckColumn || !this.props.isPro) return null

    let Component, noRefresh, accountId, icon = null
    let componentParams = {}
    let title, subtitle = ''

    switch (deckColumn) {
      case 'notifications':
        title = 'Notifications'
        icon = 'notifications'
        Component = Notifications
        break
      case 'home':
        title = 'Home'
        icon = 'home'
        Component = HomeTimeline
        break
      case 'compose':
        title = 'Compose'
        icon = 'pencil'
        Component = Compose
        noRefresh = true
        break
      case 'likes':
        title = 'Likes'
        icon = 'like'
        Component = LikedStatuses
        componentParams = { params: { username: meUsername }}
        break
      case 'bookmarks':
        title = 'Bookmarks'
        icon = 'bookmark'
        Component = BookmarkedStatuses
        componentParams = { params: { username: meUsername }}
        break
      case 'pro':
        title = 'Pro Timeline'
        icon = 'pro'
        Component = ProTimeline
        break
      case 'news':
        title = 'News'
        icon = 'news'
        Component = News
        componentParams = { isSmall: true }
        break
      case 'explore':
        title = 'Explore'
        icon = 'explore'
        Component = ExploreTimeline
        break
      default:
        break
    }

    if (!Component) {
      if (deckColumn.indexOf('user.') > -1)  {
        const userAccountId = deckColumn.replace('user.', '')
        title = 'User'
        Component = AccountTimeline
        componentParams = { id: userAccountId }
        accountId = userAccountId
      } else if (deckColumn.indexOf('list.') > -1)  {
        const listId = deckColumn.replace('list.', '')
        title = 'List'
        subtitle = listId
        icon = 'list'
        Component = ListTimeline
        componentParams = { params: { id: listId }} 
      } else if (deckColumn.indexOf('group.') > -1)  {
        const groupId = deckColumn.replace('group.', '')
        title = 'Group'
        subtitle = groupId
        icon = 'group'
        Component = GroupTimeline
        componentParams = { params: { id: groupId }} 
      } else if (deckColumn.indexOf('news.') > -1)  {
        // : todo :        
      } else if (deckColumn.indexOf('hashtag.') > -1)  {
        const hashtag = deckColumn.replace('hashtag.', '')
        title = 'Hashtag'
        subtitle = hashtag
        icon = 'apps'
        Component = HashtagTimeline
        componentParams = { params: { id: hashtag }} 
      }
    }

    if (!Component) return null

    return (
      <SortableItem
        key={`deck-column-${index}`}
        index={index}
        sortIndex={index}
      >
        <DeckColumn
          title={title}
          subtitle={subtitle}
          icon={icon}
          index={index}
          noRefresh={noRefresh}
          accountId={accountId}
        >
          <WrappedBundle component={Component} componentParams={componentParams} />
        </DeckColumn>
      </SortableItem>
    )
  }

  render () {
    const { gabDeckOrder, isPro } = this.props

    const isEmpty = gabDeckOrder.size === 0

    const title = (
      <span className={[_s.d, _s.flexRow, _s.jcCenter, _s.aiCenter].join(' ')}>
        <span className={[_s.d, _s.mr2].join(' ')}>
          Gab Deck for Gab
        </span>
        <span className={[_s.bgPro, _s.cBlack, _s.radiusSmall, _s.px5, _s.py5].join(' ')}>PRO</span>
      </span>
    )

    return (
      <SortableContainer
        axis='x'
        lockAxis='x'
        onSortEnd={this.onSortEnd}
        shouldCancelStart={this.onShouldCancelStart}
      >
        {
          (isEmpty || !isPro) &&
          <React.Fragment>
            <DeckColumn title='Compose' icon='pencil' noButtons>
              <WrappedBundle component={Compose} />
            </DeckColumn>
            {
              !isPro &&
              <DeckColumn title={title} icon='pro' noButtons>
                <div className={[_s.d, _s.px15, _s.py15].join(' ')}>
                  <Text>
                    GabDeck is a unique way to customize your Gab experience. Upgrade to GabPRO to unlock the GabDeck.
                  </Text>
                  <div className={[_s.mt15, _s.d, _s.flexRow].join(' ')}>
                    <Button href={URL_GAB_PRO}>
                      <Text color='inherit' className={_s.px10}>
                        Upgrade to GabPRO
                      </Text>
                    </Button>
                  </div>
                </div>
              </DeckColumn>
            }
            <DeckColumn title='Explore' icon='explore' noButtons>
              <WrappedBundle component={ExploreTimeline} />
            </DeckColumn>
            <DeckColumn title='News' icon='news' noButtons>
              <WrappedBundle component={News} componentParams={{ isSmall: true }} />
            </DeckColumn>
            <DeckColumn />
          </React.Fragment>
        }
        {
          !isEmpty && isPro &&
          gabDeckOrder.map((deckOption, i) => this.getDeckColumn(deckOption, i))
        }
      </SortableContainer>
    )
  }

}

const SortableItem = sortableElement(({children}) => (
  <div>
    {children}
  </div>
))

const SortableContainer = sortableContainer(({children}) => (
  <div className={[_s.d, _s.flexRow, _s.listStyleNone].join(' ')}>
    {children}
  </div>
))

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
  gabDeckOrder: state.getIn(['settings', 'gabDeckOrder']),
})

Deck.propTypes = {
  isPro: PropTypes.bool.isRequired,
  gabDeckOrder: ImmutablePropTypes.list,
}

export default connect(mapStateToProps)(Deck)
