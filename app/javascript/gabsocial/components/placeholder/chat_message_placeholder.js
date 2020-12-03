import React from 'react'
import PropTypes from 'prop-types'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'

export default class ChatMessagePlaceholder extends React.PureComponent {

  render() {
    const alt = getRandomInt(0, 1) === 1
    const width = getRandomInt(120, 240)
    const height = getRandomInt(40, 110)
    
    if (alt) {
      return (
        <PlaceholderLayout viewBox='0 0 400 110' preserveAspectRatio='xMaxYMin meet'>
          <rect x='80' y='0' rx='20' ry='20' width='260' height={height} />
          <circle cx='380' cy='20' r='20' /> 
        </PlaceholderLayout>
      )
    }

    return (
      <PlaceholderLayout viewBox='0 0 400 110' preserveAspectRatio='xMinYMax meet'>
        <circle cx='20' cy='20' r='20' /> 
        <rect x='60' y='0' rx='20' ry='20' width={width} height={height} />
      </PlaceholderLayout>
    )

  }

}