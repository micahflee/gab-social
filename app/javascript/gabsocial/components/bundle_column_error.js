import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import {
  source_url,
  version,
} from '../initial_state'
import {
  APP_NAME,
  DEFAULT_REL,
} from '../constants'
import Button from './button'
import Divider from './divider'
import Icon from './icon'
import Text from './text'

class BundleColumnError extends React.PureComponent {

  handleRetry = () => {
    this.props.onRetry()
  }

  render () {
    const { intl: { formatMessage } } = this.props

    return (
      <div className={[_s.d, _s.minH100VH, _s.w100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
        <div className={[_s.d, _s.minH53PX, _s.bgBrand, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
          <div className={[_s.d, _s.flexRow, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w1255PX].join(' ')}>

            <div className={[_s.d, _s.flexRow].join(' ')}>

              <h1 className={[_s.d, _s.mr15].join(' ')}>
                <Button href='/' isText aria-label='Gab' className={[_s.d, _s.jcCenter, _s.noSelect, _s.noUnderline, _s.h53PX, _s.cursorPointer, _s.px10, _s.mr15].join(' ')}>
                  <Icon id='logo' className={_s.cWhite} />
                </Button>
              </h1>

            </div>
          </div>
        </div>

        <div className={[_s.d, _s.maxW640PX, _s.px15, _s.py10].join(' ')}>

          <Icon id='warning' size='28px' className={[_s.d, _s.cSecondary, _s.mb15].join(' ')} />

          <Text size='medium' className={_s.pt15}>
            {formatMessage(messages.body)}
          </Text>

          <div className={[_s.d, _s.py10, _s.my10].join(' ')}>
            <Text>
              {APP_NAME} ({version})
            </Text>

            <div className={[_s.d, _s.flexRow, _s.mt10, _s.aiCenter].join(' ')}>
              <Button
                isText
                href={source_url}
                rel={DEFAULT_REL}
                target='_blank'
                backgroundColor='tertiary'
                color='primary'
                radiusSmall
                className={[_s.py2, _s.px10].join(' ')}
              >
                <Text color='inherit'>
                  <FormattedMessage
                    id='errors.unexpected_crash.report_issue'
                    defaultMessage='Report issue'
                  />
                </Text>
              </Button>

            </div>
          </div>

          <Divider />

          <div className={[_s.d, _s.flexRow].join(' ')}>
            <Button
              icon='repost'
              onClick={this.handleRetry} size={64}
            >
              <Text align='center' color='inherit' className={_s.ml5}>
                {formatMessage(messages.retry)}
              </Text>
            </Button>
          </div>

        </div>
      </div>
    )
  }

}

const messages = defineMessages({
  title: { id: 'bundle_column_error.title', defaultMessage: 'Network error' },
  body: { id: 'bundle_column_error.body', defaultMessage: 'Something went wrong while loading this component.' },
  retry: { id: 'bundle_column_error.retry', defaultMessage: 'Try again' },
})

BundleColumnError.propTypes = {
  onRetry: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(BundleColumnError)