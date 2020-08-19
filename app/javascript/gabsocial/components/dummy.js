import React from 'react'

export default class Dummy extends React.PureComponent {

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    )
  }

}