import React from 'react'
import PropTypes from 'prop-types'

export default class Dummy extends React.PureComponent {

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    )
  }

}