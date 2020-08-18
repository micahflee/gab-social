import React from 'react'
import Block from '../block'
import ColumnIndicator from '../column_indicator'

const LoadingModal = () => (
  <div className={_s.w330PX}>
    <Block>
      <div className={[_s.d, _s.px15, _s.py15, _s.mt15, _s.mb15].join(' ')}>
        <div className={[_s.d, _s.px15, _s.py15, _s.mt15, _s.mb15, _s.aiCenter, _s.jcCenter].join(' ')}>
          <ColumnIndicator type='loading' />
        </div>
      </div>
    </Block>
  </div>
)
 
export default LoadingModal