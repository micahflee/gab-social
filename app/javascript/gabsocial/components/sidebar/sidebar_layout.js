import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CX } from '../../constants'
import {
  me,
  emailConfirmed,
} from '../../initial_state'
import Button from '../button'
import Heading from '../heading'
import BackButton from '../back_button'
import Pills from '../pills'

class SidebarLayout extends React.PureComponent {

  render() {
    const {
      actions,
      tabs,
      title,
      showBackBtn,
      children,
    } = this.props

    const innerContainerClasses = CX({
      d: 1,
      posFixed: 1,
      calcH53PX: emailConfirmed || !me,
      calcH106PX: !emailConfirmed && !!me,
      bottom0: 1,
    })

    return (
      <header role='banner' className={[_s.d, _s.flexGrow1, _s.z3, _s.aiEnd].join(' ')}>
        <div className={[_s.d, _s.w240PX].join(' ')}>
          <div className={innerContainerClasses}>
            <div className={[_s.d, _s.h100PC, _s.aiStart, _s.w240PX, _s.pr15, _s.py10, _s.noScrollbar, _s.overflowYScroll].join(' ')}>
              <div className={[_s.d, _s.w100PC].join(' ')}>
                {
                  !!title &&
                  <div className={[_s.d, _s.flexRow, _s.px5, _s.pt10, _s.minH40PX, _s.aiStart].join(' ')}>
                    {
                      showBackBtn &&
                      <BackButton
                        icon='arrow-left'
                      />
                    }
                    <Heading size='h1'>
                      {title}
                    </Heading>
                    {
                      !!actions &&
                      <div className={[_s.d, _s.bgTransparent, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.mlAuto].join(' ')}>
                        {
                          actions.map((action, i) => (
                            <Button
                              isNarrow
                              backgroundColor='tertiary'
                              color='primary'
                              onClick={action.onClick ? () => action.onClick() : undefined}
                              to={action.to}
                              href={action.href}
                              key={`action-btn-${i}`}
                              className={[_s.ml5, _s.px5].join(' ')}
                              icon={action.icon}
                              iconClassName={[_s.cSecondary, _s.px5, _s.py5].join(' ')}
                              iconSize='15px'
                            />
                          ))
                        }
                      </div>
                    }
                  </div>
                }
                {
                  !!tabs &&
                  <div className={[_s.d, _s.mt10, _s.pb10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
                    <Pills pills={tabs} />
                  </div>
                }
              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.d, _s.w100PC, _s.mb15].join(' ')}>
                {children}
              </nav>

            </div>
          </div>
        </div>
      </header>
    )
  }

}

SidebarLayout.propTypes = {
  actions: PropTypes.array,
  tabs: PropTypes.array,
  title: PropTypes.string,
  showBackBtn: PropTypes.bool,
}

export default SidebarLayout