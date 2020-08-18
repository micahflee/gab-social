import React from 'react'
import Block from '../block'
import ColumnIndicator from '../column_indicator'

const LoadingModal = () => (
  <div className={_s.width330PX}>
    <Block>
      <div className={[_s.default, _s.px15, _s.py15, _s.mt15, _s.mb15].join(' ')}>
        <div className={[_s.default, _s.px15, _s.py15, _s.mt15, _s.mb15, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
          <ColumnIndicator type='loading' />
        </div>
      </div>
    </Block>
  </div>
)
 
export default LoadingModal