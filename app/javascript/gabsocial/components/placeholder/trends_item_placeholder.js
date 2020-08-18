import React from 'react'
import PropTypes from 'prop-types'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'

export default class TrendsItemPlaceholder extends React.PureComponent {
  
  render() {
    const title1Width = getRandomInt(280, 330)
    const title2Width = getRandomInt(200, 305)
    const title3Width = getRandomInt(100, 220)

    const subtitle2Width = getRandomInt(140, 240)
    const subtitle3Width = getRandomInt(120, 225)

    return (
      <div className={[_s.d, _s.px15, _s.py10, _s.pb5, _s.mb5].join(' ')}>
        <PlaceholderLayout viewBox='0 0 340 138'>
          <rect x='0' y='0' rx='3' ry='3' width={title1Width} height='12' />
          <rect x='0' y='23' rx='3' ry='3' width={title2Width} height='12' />
          <rect x='0' y='43' rx='3' ry='3' width={title3Width} height='12' />
          <rect x='0' y='67' rx='3' ry='3' width='260' height='8' />
          <rect x='0' y='85' rx='3' ry='3' width={subtitle2Width} height='8' />
          <rect x='0' y='101' rx='3' ry='3' width={subtitle3Width} height='8' />
          <rect x='0' y='120' rx='3' ry='3' width='20' height='8' />
          <rect x='30' y='120' rx='3' ry='3' width='120' height='8' />
          <rect x='160' y='120' rx='3' ry='3' width='20' height='8' />
        </PlaceholderLayout>
      </div>
    )
  }

}