import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'

export default class CommentPlaceholder extends React.PureComponent {
  
  render() {
    const classes = CX({
      d: 1,
      px15: 1,
      py10: 1,
    })

    const width = getRandomInt(200, 350)

    return (
      <div className={classes}>
        <PlaceholderLayout viewBox='0 0 400 52'>
          <rect x='27' y='0' rx='4' ry='4' width={width} height='40' /> 
          <circle cx='10' cy='11' r='10' />
          <rect x='30' y='45' rx='4' ry='4' width='24' height='6' /> 
          <rect x='62' y='45' rx='4' ry='4' width='28' height='6' /> 
          <rect x='98' y='45' rx='4' ry='4' width='18' height='6' />     
        </PlaceholderLayout>
      </div>
    )
  }

}