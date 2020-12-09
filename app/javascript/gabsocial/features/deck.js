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
  deckConnect,
  deckDisconnect,
  updateDeckColumnAtIndex,
} from '../actions/deck'
import {
  saveSettings,
} from '../actions/settings'
import WrappedBundle from './ui/util/wrapped_bundle'
import DeckColumn from '../components/deck_column'
import {
  AccountTimeline,
  Compose,
  LikedStatuses,
  HomeTimeline,
  Notifications,
  HashtagTimeline,
  BookmarkedStatuses,
  ProTimeline,
} from './ui/util/async_components'

class Deck extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount () {
    this.props.connectDeck()
  }

  componentWillUnmount() {
    this.props.disconnectDeck()
  }

  componentDidMount () {
    this.props.dispatch(deckConnect())
  }

  componentWillUnmount() {
    this.props.dispatch(deckDisconnect())
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
    if (!deckColumn) return null

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
      default:
        break
    }

    if (!Component) {
      if (deckColumn.indexOf('user.') > -1)  {
        
      } else if (deckColumn.indexOf('list.') > -1)  {
        
      } else if (deckColumn.indexOf('group.') > -1)  {
        
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
    const { gabDeckOrder } = this.props

    console.log("gabDeckOrder:", gabDeckOrder)

    const isEmpty = gabDeckOrder.size === 0
    // : todo : max: 12

    return (
      <SortableContainer
        axis='x'
        lockAxis='x'
        onSortEnd={this.onSortEnd}
        shouldCancelStart={this.onShouldCancelStart}
      >
        {
          isEmpty &&
          <React.Fragment>
            <DeckColumn title='Compose' icon='pencil'>
              <WrappedBundle component={Compose} />
            </DeckColumn>
            <DeckColumn />
          </React.Fragment>
        }
        {
          !isEmpty &&
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
  gabDeckOrder: state.getIn(['settings', 'gabDeckOrder']),
})

Deck.propTypes = {
  gabDeckOrder: ImmutablePropTypes.list,
}

export default connect(mapStateToProps)(Deck)
