import React from 'react'
import PropTypes from 'prop-types'
import PlaceholderLayout from './placeholder_layout'

export default class ProfileInfoPanelPlaceholder extends React.PureComponent {
  
  render() {
    return (
      <div className={_s.d}>
        <PlaceholderLayout viewBox='0 0 340 108'>
          <rect x='0' y='0' rx='4' ry='4' width='330' height='8' /> 
          <rect x='0' y='18' rx='4' ry='4' width='314' height='8' /> 
          <rect x='0' y='36' rx='4' ry='4' width='234' height='8' /> 
          <rect x='0' y='54' rx='4' ry='4' width='204' height='8' /> 
          <rect x='0' y='94' rx='4' ry='4' width='134' height='8' /> 
          <rect x='10' y='78' rx='3' ry='3' width='320' height='1' />
        </PlaceholderLayout>
      </div>
    )
  }

}