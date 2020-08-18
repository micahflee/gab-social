import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Button from './button'
import Text from './text'

class ProgressBar extends React.PureComponent {

  render() {
    const {
      progress,
      small,
      title,
      href,
    } = this.props

    const completed = Math.min(parseFloat(progress), 100)
    const style = {
      width: `${completed}%`,
    }

    const containerClassName = CX({
      d: 1,
      bgLoading: !small,
      bgSecondary: small,
      noUnderline: 1,
      circle: 1,
      overflowHidden: 1,
      cursorPointer: 1,
      h22PX: !small,
      h4PX: small,
    })

    return (
      <Button 
        href={href}
        noClasses
        className={containerClassName}
      >
        <div className={[_s.d, _s.bgBrand, _s.circle, _s.h100PC, _s.backgroundCandy].join(' ')} style={style} />
        <div className={[_s.d, _s.posAbs,  _s.w100PC, _s.h100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
          {
            !!title &&
            <Text size='small' weight='bold' color='white' className={_s.textShadow}>
              {title}
            </Text>
          }
        </div>
      </Button>
    )
  }
}

ProgressBar.propTypes = {
  progress: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  small: PropTypes.bool,
  title: PropTypes.string,
  href: PropTypes.string,
}

export default ProgressBar