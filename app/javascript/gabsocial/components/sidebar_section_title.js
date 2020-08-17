import React from 'react'
import PropTypes from 'prop-types'
import Text from './text'

export default class SidebarSectionTitle extends React.PureComponent {

  static propTypes = {
    children: PropTypes.string.isRequired,
  }

  render() {
    const { children } = this.props

    return (
      <div className={[_s.default, _s.py5, _s.px10, _s.mt10].join(' ')}>
        <Text color='tertiary'>
          {children}
        </Text>
      </div>
    )
  }

}
