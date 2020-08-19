import React from 'react'

const Block = ({ children }) => (
  <div className={[_s.d, _s.boxShadowBlock, _s.bgPrimary, _s.overflowHidden, _s.radiusSmall].join(' ')}>
    {children}
  </div>
)

export default Block