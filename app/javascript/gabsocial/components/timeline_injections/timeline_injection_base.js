import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../../initial_state'
import {
  TIMELINE_INJECTION_PWA,
  TIMELINE_INJECTION_WEIGHT_MULTIPLIER,
} from '../../constants'
import TimelineInjectionRoot from './timeline_injection_root'

class TimelineInjectionBase extends ImmutablePureComponent {

  state = {
    injectionType: {}
  }

  componentDidMount() {
    const { injectionWeights } = this.props

    const keys = injectionWeights.keySeq().toArray() 
    const values = injectionWeights.valueSeq().toArray()
    
    const weights = values.map((a) => Math.max(Math.ceil(a * TIMELINE_INJECTION_WEIGHT_MULTIPLIER), 0.01))
    const totalWeight = weights.reduce((a, b) => a + b, 0)

    let weighedElems = []
    let currentElem = 0
    while (currentElem < keys.length) {
      for (let i = 0; i < weights[currentElem]; i++) {
        weighedElems[weighedElems.length] = currentElem
      }
      currentElem++
    }
    
    const rnd = Math.floor(Math.random() * totalWeight)
    const index = weighedElems[rnd]
    const injectionType = keys[index]
    
    this.setState({ injectionType })
  }

  render() {
    const { injectionType } = this.state

    // : todo :
    // hide PWA for now
    if (injectionType === TIMELINE_INJECTION_PWA) return <div />

    if (!me) return <div />

    return <TimelineInjectionRoot type={injectionType} />
  }

}

const mapStateToProps = (state) => ({
  injectionWeights: state.getIn(['settings', 'injections']),
})

TimelineInjectionBase.propTypes = {
  index: PropTypes.number,
  injectionWeights: ImmutablePropTypes.map,
}

export default connect(mapStateToProps)(TimelineInjectionBase)