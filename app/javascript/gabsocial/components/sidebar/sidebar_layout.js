import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CX,
  BREAKPOINT_SMALL,
} from '../../constants'
import {
  me,
  emailConfirmed,
} from '../../initial_state'
import Button from '../button'
import { openModal } from '../../actions/modal'
import Responsive from '../../features/ui/util/responsive_component'
import Heading from '../heading'
import BackButton from '../back_button'
import Pills from '../pills'

class SidebarLayout extends React.PureComponent {

  handleOpenComposeModal = () => {
    this.props.onOpenComposeModal()
  }

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
                  <div className={[_s.d, _s.flexRow, _s.px5, _s.pt10].join(' ')}>
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
                              backgroundColor='none'
                              color='primary'
                              onClick={action.onClick ? () => action.onClick() : undefined}
                              to={action.to}
                              key={`action-btn-${i}`}
                              className={[_s.ml5, _s.px5].join(' ')}
                              icon={action.icon}
                              iconClassName={_s.cPrimary}
                              iconSize='14px'
                            />
                          ))
                        }
                      </div>
                    }
                  </div>
                }
                {
                  !!tabs &&
                  <div className={[_s.d, _s.mt10, _s.pb15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
                    <Pills pills={tabs} />
                  </div>
                }
              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.d, _s.w100PC, _s.mb15].join(' ')}>
                {children}
              </nav>

              <Responsive min={BREAKPOINT_SMALL}>
                <Button
                  isBlock
                  onClick={this.handleOpenComposeModal}
                  className={[_s.py15, _s.fs15PX, _s.fw600].join(' ')}
                >
                  Gab
                </Button>
              </Responsive>

              <Responsive max={BREAKPOINT_SMALL}>
                <Button
                  onClick={this.handleOpenComposeModal}
                  className={_s.py15}
                  icon='pencil'
                />
              </Responsive>

            </div>
          </div>
        </div>
      </header>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onOpenComposeModal() {
    dispatch(openModal('COMPOSE'))
  },
})

SidebarLayout.propTypes = {
  onOpenComposeModal: PropTypes.func.isRequired,
  actions: PropTypes.array,
  tabs: PropTypes.array,
  title: PropTypes.string,
  showBackBtn: PropTypes.bool,
}

export default connect(null, mapDispatchToProps)(SidebarLayout)