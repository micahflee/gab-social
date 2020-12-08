import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  deckConnect,
  deckDisconnect,
} from '../actions/deck'
import WrappedBundle from './ui/util/wrapped_bundle'
import DeckColumn from '../components/deck_column'
import {
  AccountTimeline,
  Compose,
  HomeTimeline,
  Notifications,
  HashtagTimeline,
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

  render () {
    const { gabDeckOrder } = this.props

    console.log("gabDeckOrder:", gabDeckOrder)

    return (
      <div className={[_s.d, _s.flexRow].join(' ')}>
        <DeckColumn title='Compose' icon='pencil'>
          <WrappedBundle component={Compose} />
        </DeckColumn>
        <DeckColumn />
        {/*<DeckColumn title='Home' icon='home'>
          <WrappedBundle component={HomeTimeline} />
        </DeckColumn>
        <DeckColumn title='Notifications' icon='notifications'>
          <WrappedBundle component={Notifications} />
        </DeckColumn>
        <DeckColumn title='Cashtag' icon='list' subtitle='$BTC'>
          <WrappedBundle component={HashtagTimeline} componentParams={{ params: { id: 'btc' } }} />
        </DeckColumn>
        <DeckColumn title='Jonny' icon='group' subtitle='@admin'>
          <WrappedBundle component={AccountTimeline} componentParams={{ account }} />
        </DeckColumn>
        </DeckColumn>*/}
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  gabDeckOrder: state.getIn(['settings', 'gabDeckOrder']),
})

Deck.propTypes = {
  gabDeckOrder: ImmutablePropTypes.list,
}

export default connect(mapStateToProps)(Deck)
