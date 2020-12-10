import React from 'react'
import ComposeExtraButton from './compose_extra_button'

class MoreButton extends React.PureComponent {
  render () {
    return <ComposeExtraButton title='More' icon='more' iconClassName={_s.cTertiary} />
  }
}

export default MoreButton