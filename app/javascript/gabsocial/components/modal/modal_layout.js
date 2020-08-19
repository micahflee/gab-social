import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import { CX } from '../../constants'
import Button from '../button'
import Block from '../block'
import Heading from '../heading'

class ModalLayout extends React.PureComponent {

  onHandleCloseModal = () => {
    this.props.onClose()
  }

  render() {
    const {
      title,
      children,
      intl,
      width,
      hideClose,
      noPadding,
      isXS,
    } = this.props

    const childrenContainerClasses = CX({
      d: 1,
      maxH80VH: 1,
      overflowYScroll: 1,
      px15: !noPadding,
      py10: !noPadding,
    })

    return (
      <div style={{width: `${width}px`}} className={[_s.d, _s.modal].join(' ')}>
        <Block>
          <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.h53PX, _s.px15].join(' ')}>
            <Heading size='h2'>
              {title}
            </Heading>
            {
              !hideClose && !isXS &&
              <Button
                backgroundColor='none'
                title={intl.formatMessage(messages.close)}
                className={_s.mlAuto}
                onClick={this.onHandleCloseModal}
                color='secondary'
                icon='close'
                iconSize='10px'
              />
            }
          </div>
          <div className={childrenContainerClasses}>
            {children}
          </div>
        </Block>
      </div>
    )
  }

}

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
})

ModalLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number,
  hideClose: PropTypes.bool,
  noPadding: PropTypes.bool,
  isXS: PropTypes.bool,
}

ModalLayout.defaultProps = {
  width: 600,
}

export default injectIntl(ModalLayout)