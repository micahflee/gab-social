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

  handleOnOpenAlbumCreation = () => {

  }

  render() {
    const {
      album,
      isAddable,
      isDummy,
    } = this.props
    
    const title = isAddable ? 'New album' : 'Album title'
    const subtitle = isAddable ? '' : '10 Items'
    const to = isAddable ? undefined : `/photos`

    return (
      <div className={[_s.d, _s.minW162PX, _s.px5, _s.flex1].join(' ')}>
        {
          !isDummy &&
          <Button
            noClasses
            className={[_s.d, _s.noUnderline, _s.noOutline, _s.bgTransparent].join(' ')}
            to={to}
            onClick={isAddable ? this.handleOnOpenAlbumCreation : undefined}
          >
            <div className={[_s.d, _s.w100PC, _s.mt5, _s.mb10].join(' ')}>
              <div className={[_s.d, _s.w100PC, _s.pt100PC].join(' ')}>
                <div className={[_s.d, _s.posAbs, _s.top0, _s.w100PC, _s.right0, _s.bottom0, _s.left0].join(' ')}>
                  <div className={[_s.d, _s.w100PC, _s.h100PC, _s.aiCenter, _s.jcCenter, _s.radiusSmall, _s.bgTertiary, _s.border1PX, _s.borderColorSecondary].join(' ')}>
                    { isAddable && <Icon id='add' size='20px' /> }
                  </div>
                </div>
              </div>
            </div>
            <div className={[_s.d, _s.w100PC, _s.pt7, _s.mb15].join(' ')}>
              <Text weight='bold'>{title}</Text>
              { !isAddable && <Text color='secondary' size='small' className={_s.mt5}>{subtitle}</Text> }
            </div>
          </Button>
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