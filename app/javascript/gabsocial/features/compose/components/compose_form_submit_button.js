import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../../../constants'
import Button from '../../../components/button'
import Text from '../../../components/text'

class ComposeFormSubmitButton extends React.PureComponent {

  render() {
    const {
      title,
      active,
      small,
      disabledButton,
    } = this.props

    const containerClasses = CX({
      d: 1,
      mr5: 1,
      jcCenter: 1,
      h40PX: 1,
    })

    const btnClasses = CX({
      d: 1,
      circle: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      bgTransparent: 1,
      flexRow: 1,
      bgSubtle_onHover: !active,
      bgBrandLight: active,
      py10: 1,
      px10: 1,
    })

    const iconClasses = CX({
      cSecondary: !active,
      cWhite: active,
      mr10: 1,
      py2: small,
      ml10: small,
    })

    const iconSize = !small ? '18px' : '16px'
    const textColor = !active ? 'primary' : 'white'

    return (
      <div className={containerClasses}>
        <div className={[_s.d, _s.w100PC, _s.py10, _s.px10].join(' ')}>
          <Button
            isBlock
            isDisabled={disabledButton}
            backgroundColor={disabledButton ? 'secondary' : 'brand'}
            color={disabledButton ? 'tertiary' : 'white'}
            className={[_s.fs15PX, _s.px15, _s.flexGrow1, _s.mlAuto].join(' ')}
            onClick={this.handleSubmit}
          >
            <Text color='inherit' weight='medium' align='center'>
              post
            </Text>
          </Button>
        </div>
      </div>
    )
  }

}

// {intl.formatMessage(scheduledAt ? messages.schedulePost : edit ? messages.postEdit : messages.post)}
ComposeFormSubmitButton.propTypes = {
  
}

export default ComposeFormSubmitButton