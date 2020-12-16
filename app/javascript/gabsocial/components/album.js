import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { CX } from '../constants'
import Button from './button'
import Icon from './icon'
import Image from './image'
import Text from './text'

class Album extends React.PureComponent {

  handleOnClick = (e) => {
    // 
  }

  render() {
    const { album } = this.props
    
    return (
      <Button
        to={to}
        href={href}
        onClick={this.handleOnClick}
        noClasses
      >

      </Button>
    )
  }

}

Album.propTypes = {
  album: ImmutablePropTypes.map,
  isAddable: PropTypes.bool,
}

export default Album