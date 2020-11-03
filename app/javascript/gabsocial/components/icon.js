import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Logo from './logo'
import Loading from './loading'
import VerifiedIcon from './verified_icon'

class Icon extends React.PureComponent {

  render() {
    const {
      className,
      id,
      size,
      minimizeLogo,
    } = this.props

    if (id === 'logo') {
      if (minimizeLogo) {
        return (
          <div className={[_s.d, _s.px5, _s.py5, _s.circle, _s.bgNavigationBlendLight].join(' ')}>
            <i className={[_s.gfi, _s['gfi-gab-g'], _s.px5, _s.py5, _s.fillNavigationBrand].join(' ')} style={{fontSize: '22px'}} />
          </div>
        )
      }
      return <Logo className={className} />
    }
    else if (id === 'loading') return <Loading size={size} className={className} />
    else if (id === 'verified') return <VerifiedIcon size={size} className={className} />

    const additionalClasses = {}
    additionalClasses.gfi = 1
    additionalClasses[`gfi-${id}`] = 1
      
    const classes = CX(className, additionalClasses)

    return <i style={{ fontSize: size }} className={classes} />

  }

}

Icon.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  size: PropTypes.string,
  minimizeLogo: PropTypes.bool,
}

export default Icon