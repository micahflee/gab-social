import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { openModal } from '../../actions/modal'
import { showToast } from '../../actions/toasts'
import { closePopover } from '../../actions/popover'
import { TOAST_TYPE_SUCCESS } from '../../constants'
import PopoverLayout from './popover_layout'
import Button from '../button'
import Heading from '../heading'
import Text from '../text'
import List from '../list'

class SharePopover extends ImmutablePureComponent {

  state = {
    url: '',
    type: '',
  }

  componentDidMount() {
    this._setUrl()
  }
  
  componentDidUpdate() {
    this._setUrl()
  }

  _setUrl = () => {
    const { account, group, status } = this.props
    let url, type
    
    if (!!account) {
      type = 'account'
      url = account.get('url')
    } else if (!!group) {
      type = 'group'
      url = group.get('url')
    } else if (!!status) {
      type = 'status'
      url = status.get('url')
    }

    this.setState({ url, type })
  }

  handleCopy = () => {
    const { url } = this.state
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
    const { url, type } = this.state

    if (!url) return <div />

    const encodedUrl = encodeURIComponent(url)
    const mailToHref = `mailto:?subject=Gab&body=${encodedUrl}`
    const iconSize = '18px'

    return (
      <PopoverLayout
        width={360}
      >
        <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.h53PX, _s.px15].join(' ')}>
          <Heading size='h3'>
            Share Gab {type}
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
            title={`Copy this ${type}`}
            className={[_s.jcCenter, _s.aiCenter, _s.mr10, _s.px10].join(' ')}
          />
          <Button
            icon='sms'
            iconSize={iconSize}
            iconClassName={_s.inheritFill}
            color='white'
            backgroundColor='none'
            href={`sms:+&body=${encodedUrl}`}
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
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
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
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
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
            href={`https://telegram.me/share/?url=${encodedUrl}`}
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
            href={`http://www.reddit.com/submit?url=${encodedUrl}&title=Gab`}
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

const mapDispatchToProps = (dispatch) => ({
  onClosePopover: () => dispatch(closePopover()),
  onShowCopyToast() {
    dispatch(showToast(TOAST_TYPE_SUCCESS, {
      type: "SUCCESSFULLY_COPIED_TO_CLIPBOARD"
    }))
  },
})

SharePopover.propTypes = {
  onClosePopover: PropTypes.func.isRequired,
  account: ImmutablePropTypes.map,
  group: ImmutablePropTypes.map,
  status: ImmutablePropTypes.map,
}

export default connect(null, mapDispatchToProps)(SharePopover)
