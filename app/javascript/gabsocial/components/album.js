import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
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
    const { album, isDummy } = this.props
    
    return (
      <div className={[_s.d, _s.minW162PX, _s.px5, _s.flex1].join(' ')}>
        {
          !isDummy &&
          <NavLink
            className={[_s.d, _s.noUnderline].join(' ')}
            to='/'
          >
            <div className={[_s.d, _s.w100PC, _s.mt5, _s.mb10].join(' ')}>
              <div className={[_s.d, _s.w100PC, _s.pt100PC].join(' ')}>
                <div className={[_s.d, _s.posAbs, _s.top0, _s.w100PC, _s.right0, _s.bottom0, _s.left0].join(' ')}>
                  <div className={[_s.d, _s.w100PC, _s.h100PC, _s.radiusSmall, _s.bgTertiary, _s.border1PX, _s.borderColorSecondary].join(' ')} />
                </div>
              </div>
            </div>
            <div className={[_s.d, _s.w100PC, _s.pt7, _s.mb15].join(' ')}>
              <Text weight='bold'>Profile Photos</Text>
              <Text color='secondary' size='small' className={_s.mt5}>1 Item</Text>
            </div>
          </NavLink>
        }
      </div>
    )
  }

}

Album.propTypes = {
  album: ImmutablePropTypes.map,
  isAddable: PropTypes.bool,
  isDummy: PropTypes.bool,
}

export default Album