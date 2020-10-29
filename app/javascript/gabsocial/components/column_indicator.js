import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import Icon from './icon'
import Text from './text'

class ColumnIndicator extends React.PureComponent {

  render() {
    const { type, message, intl } = this.props

    const title = type !== 'error' && !message ? intl.formatMessage(messages[type]) : message

    return (
      <div className={[_s.d, _s.w100PC, _s.jcCenter, _s.aiCenter, _s.py15, _s.px10].join(' ')}>
        <Icon id={type} size='30px' className={_s.cPrimary} />
        {
          type !== 'loading' &&
          <Text
            align='center'
            size='medium'
            className={_s.mt10}
          >
            {title}
          </Text>
        }
      </div>
    )
  }

}

const messages = defineMessages({
  loading: { id: 'loading_indicator.label', defaultMessage: 'Loading..' },
  missing: { id: 'missing_indicator.sublabel', defaultMessage: 'This resource could not be found.' },
})

ColumnIndicator.propTypes = {
  intl: PropTypes.object.isRequired,
  type: PropTypes.oneOf([
    'loading',
    'missing',
    'error',
  ]),
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
}

export default injectIntl(ColumnIndicator)