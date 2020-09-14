import React from 'react'
import PropTypes from 'prop-types'
import Button from '../button'
import Text from '../text'

class PWAInjection extends React.PureComponent {

  deferredPrompt=null

  componentDidMount() {
    window.addEventListener('beforeinstallprompt',(e) => {
      console.log("e:",e)
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.deferredPrompt=e
      // Update UI notify the user they can install the PWA
      // showInstallPromotion()
    })

    window.addEventListener('appinstalled',(evt) => {
      // Log install to analytics
      console.log('INSTALL: Success')
    })

    window.addEventListener('DOMContentLoaded',() => {
      let displayMode='browser tab'
      if(navigator.standalone) {
        displayMode='standalone-ios'
      }
      if(window.matchMedia('(display-mode: standalone)').matches) {
        displayMode='standalone'
      }
      // Log launch display mode to analytics
      console.log('DISPLAY_MODE_LAUNCH:',displayMode)

      window.matchMedia('(display-mode: standalone)').addListener((evt) => {
        let displayMode='browser tab';
        if(evt.matches) {
          displayMode='standalone';
        }
        // Log display mode change to analytics
        console.log('DISPLAY_MODE_CHANGED',displayMode);
      });
    })
  }

  handleOnClick=() => {
    // Hide the app provided install promotion
    // hideMyInstallPromotion()
    // Show the install prompt
    this.deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if(choiceResult.outcome==='accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    })
  }

  render() {

    // : todo :
    return <div />

    return (
      <div className={[_s.d,_s.w100PC,_s.px15,_s.mb15].join(' ')}>
        <div className={[_s.d,_s.w100PC,_s.py15,_s.px10,_s.boxShadowBlock,_s.radiusSmall,_s.bgPrimary].join(' ')}>
          <div className={[_s.d,_s.py15,_s.px10].join(' ')}>
            <Text size='large' align='center' className={_s.mb10}>
              We’re not on the app stores, but you can still get the Gab app on your phone.
            </Text>
            <Text size='large' align='center'>
              Click install to learn how.
            </Text>
          </div>

          <div className={[_s.d,_s.mt10,_s.mb5,_s.flexRow,_s.mlAuto,_s.mrAuto].join(' ')}>
            <Button
              backgroundColor='none'
              color='secondary'
              className={_s.mr15}
            >
              Not now
            </Button>
            <Button
              onClick={this.handleOnClick}
            >
              <Text color='inherit' weight='medium' className={_s.px10}>
                Install
              </Text>
            </Button>
          </div>
        </div>
      </div>
    )

  }

}

PWAInjection.propTypes = {
  injectionId: PropTypes.string,
  isXS: PropTypes.string,
}

export default PWAInjection