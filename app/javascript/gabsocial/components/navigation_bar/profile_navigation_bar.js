import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { POPOVER_PROFILE_OPTIONS } from '../../constants'
import { openPopover } from '../../actions/popover'
import BackButton from '../back_button'
import Button from '../button'
import Heading from '../heading'

class ProfileNavigationBar extends React.PureComponent {

  handleOpenMore = () => {
    this.props.openProfileOptionsPopover({
      account: this.props.account,
      targetRef: this.openMoreNode,
      position: 'bottom',
    })
  }

  setOpenMoreNodeRef = (n) => {
    this.openMoreNode = n
  }

  render() {
    const { titleHTML } = this.props
    
    return (
      <div className={[_s.d, _s.z4, _s.minH53PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.minH53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.d, _s.flexRow, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>

            <BackButton
              className={[_s.minH53PX, _s.pl10, _s.pr10].join(' ')}
              iconSize='18px'
              iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
            />

            <div className={[_s.d, _s.minH53PX, _s.mrAuto, _s.flex1, _s.overflowHidden].join(' ')}>
              <div className={[_s.d, _s.minH53PX, _s.jcCenter, _s.w100PC].join(' ')}>
                <Heading size='h1'>
                  <div className={[_s.d, _s.w100PC].join(' ')}>
                    <span
                      className={[_s.w100PC, _s.textOverflowEllipsis, _s.colorNavigation].join(' ')}
                      dangerouslySetInnerHTML={{ __html: titleHTML }}
                    />
                  </div>
                </Heading>
              </div>
            </div>

            <div className={[_s.d, _s.minH53PX, _s.jcCenter, _s.mr15].join(' ')}>
              <Button
                icon='ellipsis'
                iconSize='26px'
                iconClassName={_s.colorNavigation}
                color='brand'
                backgroundColor='none'
                className={[_s.jcCenter, _s.aiCenter, _s.ml10, _s.px10].join(' ')}
                onClick={this.handleOpenMore}
                buttonRef={this.setOpenMoreNodeRef}
              />
            </div>

          </div>

        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  openProfileOptionsPopover(props) {
    dispatch(openPopover(POPOVER_PROFILE_OPTIONS, props))
  },
})

ProfileNavigationBar.propTypes = {
  titleHTML: PropTypes.string,
  showBackBtn: PropTypes.bool,
}

export default connect(null, mapDispatchToProps)(ProfileNavigationBar)