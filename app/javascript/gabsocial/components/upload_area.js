import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import spring from 'react-motion/lib/spring'
import Motion from '../features/ui/util/reduced_motion'
import Text from './text'

const messages = defineMessages({
  title: { id: 'upload_area.title', defaultMessage: 'Drag & drop to upload' },
})

class UploadArea extends React.PureComponent {

  handleKeyUp = (e) => {
    if (!this.props.active) return

    const keyCode = e.keyCode
    switch(keyCode) {
    case 27:
      e.preventDefault()
      e.stopPropagation()
      this.props.onClose()
      break
    }
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp, false)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  render () {
    const { active, intl } = this.props

    return (
      <Motion
        defaultStyle={{
          backgroundOpacity: 0,
          backgroundScale: 0.95
        }}
        style={{
          backgroundOpacity: spring(active ? 1 : 0, { stiffness: 150, damping: 15 }),
          backgroundScale: spring(active ? 1 : 0.95, { stiffness: 200, damping: 3 })
        }}
      >
        {({ backgroundOpacity, backgroundScale }) => (
          <div
            className={[_s.d, _s.aiCenter, _s.jcCenter, _s.bgPrimaryOpaque, _s.w100PC, _s.h100PC, _s.posAbs, _s.top0, _s.rightAuto, _s.bottomAuto, _s.left0].join(' ')}
            style={{
              visibility: active ? 'visible' : 'hidden',
              opacity: backgroundOpacity
            }}
          >
            <div className={[_s.d, _s.w340PX, _s.h260PX, _s.px10, _s.py10].join(' ')}>
              <div
                className={[_s.d, _s.posAbs, _s.bgPrimary, _s.h100PC, _s.w100PC, _s.radiusSmall].join(' ')}
                style={{
                  transform: `scale(${backgroundScale})`
                }}
              />
              <div className={[_s.d, _s.h100PC, _s.w100PC, _s.border2PX, _s.borderColorSecondary, _s.borderDashed, _s.radiusSmall, _s.aiCenter, _s.jcCenter].join(' ')}>
                <Text size='medium' color='secondary'>
                  {intl.formatMessage(messages.title)}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Motion>
    )
  }

}

UploadArea.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(UploadArea)