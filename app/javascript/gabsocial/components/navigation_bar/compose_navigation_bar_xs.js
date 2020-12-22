import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { length } from 'stringz'
import { openPopover } from '../../actions/popover'
import {
  CX,
  MAX_POST_CHARACTER_COUNT,
} from '../../constants'
import Heading from '../heading'
import Button from '../button'
import BackButton from '../back_button'
import ComposeFormSubmitButton from '../../features/compose/components/compose_form_submit_button'

class ComposeNavigationBar extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }
  
  render() {
    const { isXS } = this.props

    const innerClasses = CX({
      d: 1,
      flexRow: 1,
      saveAreaInsetPT: 1,
      saveAreaInsetPL: 1,
      saveAreaInsetPR: 1,
      w100PC: 1,
      maxW640PX: !isXS,
      mlAuto: !isXS,
      mrAuto: !isXS,
    })

    return (
      <div className={[_s.d, _s.z4, _s.minH53PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.minH53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
        
          <div className={innerClasses}>

            <BackButton
              toHome
              className={[_s.h53PX, _s.pl10, _s.pr10].join(' ')}
              iconSize='18px'
              iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
            />

            <div className={[_s.d, _s.h53PX, _s.flexRow, _s.jcCenter, _s.aiCenter, _s.mrAuto].join(' ')}>
              <Heading size='h1'>
                <span className={[_s.dangerousContent, _s.fs24PX, _s.colorNavigation].join(' ')}>
                  Compose
                </span>
              </Heading>
            </div>

            <div className={[_s.d, _s.h53PX, _s.flexRow, _s.mlAuto, _s.aiCenter, _s.jcCenter, _s.mr15].join(' ')}>
              <ComposeFormSubmitButton type='navigation' router={this.context.router} />
            </div>

          </div>

        </div>
      </div>
    )
  }

}

ComposeNavigationBar.propTypes = {
  isXS: PropTypes.bool,
}

export default ComposeNavigationBar