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
import {
  AccountTimeline,
  Compose,
  LikedStatuses,
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
    console.log("this.props.isPro:", this.props)
    if (!this.props.isPro) this.handleOnOpenProUpgradeModal()
  }

  componentWillUnmount() {
    this.props.dispatch(deckDisconnect())
  }

  handleOnOpenProUpgradeModal = () => {
    console.log("handleOnOpenProUpgradeModal")
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
    if (!deckColumn || !isPro) return null

    let Component = null
    let componentParams = {}
    let title, icon = ''

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

    // : todo :
    if (!Component) {
      if (deckColumn.indexOf('user.') > -1)  {
        
      } else if (deckColumn.indexOf('list.') > -1)  {
        
      } else if (deckColumn.indexOf('group.') > -1)  {
        
      } else if (deckColumn.indexOf('news.') > -1)  {
        
      } else if (deckColumn.indexOf('hashtag.') > -1)  {
        
      }
    }

    if (!Component) return null

    return (
      <SortableItem
        key={`deck-column-${index}`}
        index={index}
        sortIndex={index}
      >
        <DeckColumn title={title} icon={icon} index={index}>
          <WrappedBundle component={Component} componentParams={componentParams} />
        </DeckColumn>
      </SortableItem>
    )
  }

  render () {
    const { gabDeckOrder, isPro } = this.props

    const isEmpty = gabDeckOrder.size === 0

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
              <DeckColumn title='Gab Deck for GabPRO' icon='pro' noButtons>
                <div className={[_s.d, _s.px15, _s.py15].join(' ')}>
                  <Text>
                    Gab Deck for GabPRO
                  </Text>
                </div>
              </DeckColumn>
            }
            <DeckColumn />
          </React.Fragment>
        }
        {
          !isEmpty && isPro &&
          gabDeckOrder.splice(0, GAB_DECK_MAX_ITEMS).map((deckOption, i) => this.getDeckColumn(deckOption, i))
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
