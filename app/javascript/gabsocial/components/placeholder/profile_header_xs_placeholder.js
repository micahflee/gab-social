import React from 'react'
import PropTypes from 'prop-types'
import PlaceholderLayout from './placeholder_layout'

export default class ProfileHeaderXSPlaceholder extends React.PureComponent {
  
  render() {
    return (
      <div className={[_s.d, _s.px10, _s.py10].join(' ')}>
        <PlaceholderLayout viewBox='0 0 400 660'>
          <rect x='0' y='0' rx='0' ry='0' width='400' height='202' /> 
          <circle cx='200' cy='200' r='54' /> 
          <rect x='78' y='272' rx='9' ry='9' width='240' height='18' /> 
          <rect x='110' y='301' rx='7' ry='7' width='180' height='14' />
          <rect x='125' y='334' rx='23' ry='23' width='150' height='46' />
          <rect x='0' y='402' rx='6' ry='6' width='380' height='12' /> 
          <rect x='0' y='426' rx='6' ry='6' width='340' height='12' /> 
          <rect x='0' y='450' rx='6' ry='6' width='200' height='12' />
          <rect x='0' y='476' rx='0' ry='0' width='400' height='1' /> 
          <rect x='0' y='492' rx='6' ry='6' width='240' height='12' />
          <rect x='0' y='520' rx='0' ry='0' width='400' height='1' /> 
          <circle cx='80' cy='574' r='30' /> 
          <circle cx='200' cy='576' r='32' /> 
          <circle cx='320' cy='576' r='32' /> 
          <rect x='10' y='630' rx='11' ry='11' width='80' height='22' /> 
          <rect x='110' y='630' rx='11' ry='11' width='80' height='22' /> 
          <rect x='310' y='630' rx='11' ry='11' width='80' height='22' /> 
          <rect x='210' y='630' rx='11' ry='11' width='80' height='22' />
        </PlaceholderLayout>
      </div>
    )
  }

}