import React from 'react'
import PropTypes from 'prop-types'
import BackButton from '../back_button'
import Button from '../button'
import Heading from '../heading'

class ProfileNavigationBar extends React.PureComponent {

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

            <div className={[_s.d, _s.minH53PX, _s.jcCenter, _s.mrAuto].join(' ')}>
              <Heading size='h1'>
                <span className={[_s.textOverflowEllipsis, _s.colorNavigation].join(' ')}>
                  <div dangerouslySetInnerHTML={{ __html: titleHTML }} />
                </span>
              </Heading>
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

ProfileNavigationBar.propTypes = {
  titleHTML: PropTypes.string,
  showBackBtn: PropTypes.bool,
}

export default ProfileNavigationBar