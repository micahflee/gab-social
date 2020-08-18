import React from 'react'
import PropTypes from 'prop-types'
import PlaceholderLayout from './placeholder_layout'

export default class ProfileStatsPanelPlaceholder extends React.PureComponent {

  render() {
    return (
      <div className={_s.d}>
        <PlaceholderLayout viewBox='0 0 178 20'>
          <rect x='2' y='2' rx='4' ry='4' width='24' height='6' /> 
          <rect x='2' y='12' rx='4' ry='4' width='38' height='6' /> 
          <rect x='58' y='2' rx='4' ry='4' width='24' height='6' /> 
          <rect x='58' y='12' rx='4' ry='4' width='38' height='6' /> 
          <rect x='114' y='2' rx='4' ry='4' width='24' height='6' /> 
          <rect x='114' y='12' rx='4' ry='4' width='38' height='6' />
        </PlaceholderLayout>
      </div>
    )
  }

}