import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import WrappedBundle from './ui/util/wrapped_bundle'
import DeckColumn from '../components/deck_column'
import {
  AccountTimeline,
  HomeTimeline,
  Notifications,
  HashtagTimeline,
} from './ui/util/async_components'

class Deck extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount () {
    // this.props.connectDeck()
  }

  componentWillUnmount() {
    // this.props.disconnectDeck()
  }

  render () {
    const { account, children } = this.props

    return (
      <div className={[_s.d, _s.flexRow].join(' ')}>
        <DeckColumn title='Home' icon='home'>
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
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  account: state.getIn(['accounts', '1']),
})

const mapDispatchToProps = (dispatch) => ({
  
})

Deck.propTypes = {
  // 
}

export default connect(mapStateToProps, mapDispatchToProps)(Deck)