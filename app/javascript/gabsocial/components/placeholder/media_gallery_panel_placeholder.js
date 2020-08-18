import React from 'react'
import PropTypes from 'prop-types'
import PlaceholderLayout from './placeholder_layout'

export default class MediaGalleryPanelPlaceholder extends React.PureComponent {
  
  render() {
    return (
      <div className={_s.d}>
        <PlaceholderLayout viewBox='0 0 334 164'>
          <rect x='0' y='0' rx='4' ry='4' width='76' height='76' /> 
          <rect x='86' y='0' rx='4' ry='4' width='76' height='76' /> 
          <rect x='172' y='0' rx='4' ry='4' width='76' height='76' /> 
          <rect x='258' y='0' rx='4' ry='4' width='76' height='76' /> 
          <rect x='0' y='86' rx='4' ry='4' width='76' height='76' /> 
          <rect x='86' y='86' rx='4' ry='4' width='76' height='76' /> 
          <rect x='172' y='86' rx='4' ry='4' width='76' height='76' /> 
          <rect x='258' y='86' rx='4' ry='4' width='76' height='76' />
        </PlaceholderLayout>
      </div>
    )
  }

}