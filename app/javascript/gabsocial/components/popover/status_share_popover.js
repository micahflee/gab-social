import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../../actions/modal'
import { showToast } from '../../actions/toasts'
import { closePopover } from '../../actions/popover'
import PopoverLayout from './popover_layout'
import Button from '../button'
import Heading from '../heading'
import Text from '../text'
import List from '../list'

class StatusSharePopover extends ImmutablePureComponent {

  handleCopy = () => {
    const url = this.props.status.get('url')
    const textarea = document.createElement('textarea')

    textarea.textContent = url
    textarea.style.position = 'fixed'

    document.body.appendChild(textarea)

    try {
      textarea.select()
      document.execCommand('copy')
    } catch (e) {
      //
    }

    document.body.removeChild(textarea)
    this.props.onShowCopyToast()
    this.handleClosePopover()
  }

  handleClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { intl, status } = this.props

    if (!status) return <div />

    const encodedStatusUrl = encodeURIComponent(status.get('url'))
    const mailToHref = `mailto:?subject=Gab&body=${encodedStatusUrl}`
    const content = status.get('contentHtml')
    const iconSize = '18px'

    return (
      <PopoverLayout
        width={360}
      >
        <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.h53PX, _s.px15].join(' ')}>
          <Heading size='h3'>
            Share Gab
          </Heading>
        </div>
        <div className={[_s.d, _s.w100PC, _s.px15, _s.py15, _s.flexRow, _s.noScrollbar, _s.aiCenter, _s.overflowXScroll, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <Button
            icon='copy'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='primary'
            backgroundColor='secondary'
            onClick={this.handleCopy}
            title={intl.formatMessage(messages.copy)}
            className={[_s.jcCenter, _s.aiCenter, _s.mr10, _s.px10].join(' ')}
          />
          <Button
            icon='sms'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='white'
            backgroundColor='none'
            href={`sms:+&body=${encodedStatusUrl}`}
            target='_blank'
            title='Share via text message'
            className={[_s.jcCenter, _s.aiCenter, _s.mr10, _s.px10, _s.bgSMS].join(' ')}
          />
          <Button
            icon='facebook'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='white'
            backgroundColor='none'
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedStatusUrl}`}
            target='_blank'
            title='Share on Facebook'
            className={[_s.jcCenter, _s.aiCenter, _s.mr10, _s.px10, _s.bgFacebook].join(' ')}
          />
          <Button
            icon='twitter'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='white'
            backgroundColor='none'
            href={`https://twitter.com/intent/tweet?url=${encodedStatusUrl}`}
            target='_blank'
            title='Share on Twitter'
            className={[_s.jcCenter, _s.aiCenter, _s.mr10, _s.px10, _s.bgTwitter].join(' ')}
          />
          <Button
            icon='telegram'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='white'
            backgroundColor='none'
            href={`https://telegram.me/share/?url=${encodedStatusUrl}`}
            target='_blank'
            title='Share on Telegram'
            className={[_s.jcCenter, _s.aiCenter, _s.mr10, _s.px10, _s.bgTelegram].join(' ')}
          />
          <Button
            icon='reddit'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='white'
            backgroundColor='none'
            href={`http://www.reddit.com/submit?url=${encodedStatusUrl}&title=Gab`}
            title='Share on Reddit'
            target='_blank'
            className={[_s.jcCenter, _s.aiCenter, _s.px10, _s.mr10, _s.bgReddit].join(' ')}
          />
          <Button
            icon='email'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='white'
            backgroundColor='black'
            href={mailToHref}
            target='_blank'
            title='Share via email'
            className={[_s.jcCenter, _s.aiCenter, _s.mr10, _s.px10].join(' ')}
          />
        </div>
        <div className={[_s.d, _s.w100PC, _s.px15, _s.py15].join(' ')}>
          <Button
            color='primary'
            backgroundColor='tertiary'
            onClick={this.handleClosePopover}
            className={[_s.jcCenter, _s.aiCenter].join(' ')}
          >
            <Text color='inherit'>Cancel</Text>
          </Button>
        </div>
      </PopoverLayout>
    )
  }
}

const messages = defineMessages({
  email: { id: 'status.email', defaultMessage: 'Email this gab' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to status' },
})

const mapDispatchToProps = (dispatch) => ({
  onClosePopover: () => dispatch(closePopover()),
  onShowCopyToast() {
    dispatch(showToast())
  },
})

StatusSharePopover.propTypes = {
  intl: PropTypes.object.isRequired,
  onClosePopover: PropTypes.func.isRequired,
  status: ImmutablePropTypes.map.isRequired,
}

export default injectIntl(connect(null, mapDispatchToProps)(StatusSharePopover))
