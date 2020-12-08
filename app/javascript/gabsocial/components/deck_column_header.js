import React from 'react'
import PropTypes from 'prop-types'
import Icon from './icon'
import Text from './text'
import Button from './button'

class DeckColumnHeader extends React.PureComponent {

  render() {
    const {
      title,
      subtitle,
      icon,
      children,
    } = this.props

    return (
      <div className={[_s.d, _s.w100PC, _s.flexRow, _s.aiCenter, _s.h60PX, _s.px15, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary, _s.bgPrimary].join(' ')}>
        { !!icon && <Icon id={icon} className={_s.cPrimary} size='20px' /> }
        <div className={[_s.d, _s.flexRow, _s.aiEnd, _s.ml15].join(' ')}>
          { !!title && <Text size='large' weight='medium'>{title}</Text> }
          { !!subtitle && <Text className={_s.ml5} size='small' color='secondary'>{subtitle}</Text> }
        </div>
        <div className={[_s.d, _s.aiCenter, _s.mlAuto, _s.jcCenter].join(' ')}>
          {
            !!title &&
            <Button
              color='primary'
              backgroundColor='none'
              icon='list'
            />
          }
        </div>
      </div>
    )
  }

}

DeckColumnHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
}

export default DeckColumnHeader