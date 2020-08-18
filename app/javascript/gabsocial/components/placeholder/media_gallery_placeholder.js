import React from 'react'
import PropTypes from 'prop-types'
import PlaceholderLayout from './placeholder_layout'

export default class MediaGalleryPlaceholder extends React.PureComponent {

  render() {
    return (
      <div className={[_s.d, _s.px5, _s.py5].join(' ')}>
        <PlaceholderLayout viewBox='0 0 400 196'>
          <rect x='0' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='100' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='300' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='200' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='-2' y='100' rx='0' ry='0' width='96' height='96' /> 
          <rect x='100' y='100' rx='0' ry='0' width='96' height='96' /> 
          <rect x='300' y='100' rx='0' ry='0' width='96' height='96' /> 
          <rect x='200' y='100' rx='0' ry='0' width='96' height='96' />
        </PlaceholderLayout>
      </div>
    )
  }

}