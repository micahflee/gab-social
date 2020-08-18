import React from 'react'
import PropTypes from 'prop-types'
import Text from './text'

class SidebarSectionTitle extends React.PureComponent {

  render() {
    const { children } = this.props

    return (
      <div className={[_s.d, _s.py5, _s.px10, _s.mt10].join(' ')}>
        <Text color='tertiary'>
          {children}
        </Text>
      </div>
    )
  }

}

SidebarSectionTitle.propTypes = {
  children: PropTypes.string.isRequired,
}

export default SidebarSectionTitle