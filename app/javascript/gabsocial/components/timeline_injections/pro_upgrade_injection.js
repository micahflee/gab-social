import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { me } from '../../initial_state'
import { URL_GAB_PRO } from '../../constants'
import Button from '../button'
import Text from '../text'

class ProUpgradeInjection extends React.PureComponent {

  deferredPrompt = null

  componentDidMount() {
    
  }

  handleOnClick = () => {
   
  }

  render() {
    const { isPro } = this.props

    if (isPro) return <div />

    return (
      <div className={[_s.d, _s.w100PC, _s.px15, _s.mb15].join(' ')}>
        <div className={[_s.d, _s.w100PC, _s.py15, _s.px10, _s.boxShadowBlock, _s.radiusSmall, _s.bgPrimary].join(' ')}>
          <div className={[_s.d, _s.py15, _s.px10].join(' ')}>
            <Text size='extraLarge' align='center' weight='bold' className={_s.mb15}>
              Upgrade to GabPRO
            </Text>
            <Text size='large' color='secondary' align='center'>
              Please consider supporting us on our mission to defend free expression online for all people.
            </Text>
          </div>

          <div className={[_s.d, _s.mt10, _s.mb5, _s.flexRow, _s.mlAuto, _s.mrAuto].join(' ')}>
            <Button
              backgroundColor='secondary'
              color='secondary'
              onClick={this.handleOnClick}
              className={_s.mr10}
            >
              <Text color='inherit' className={_s.px5}>
                Not now
              </Text>
            </Button>
            <Button href={URL_GAB_PRO}>
              <Text color='inherit' weight='medium' className={_s.px15}>
                Learn More
              </Text>
            </Button>
          </div>
        </div>
      </div>
    )

  }

}

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
})

ProUpgradeInjection.propTypes = {
  isPro: PropTypes.bool.isRequired,
  injectionId: PropTypes.string,
  isXS: PropTypes.bool,
}

export default connect(mapStateToProps)(ProUpgradeInjection)