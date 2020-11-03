import React from 'react'
import PropTypes from 'prop-types'
import { BREAKPOINT_EXTRA_SMALL } from '../../constants'
import Button from '../button'
import NavigationBarButton from '../navigation_bar_button'
import Search from '../search'
import Text from '../text'
import ResponsiveComponent from '../../features/ui/util/responsive_component'
import ResponsiveClassesComponent from '../../features/ui/util/responsive_classes_component'

class LoggedOutNavigationBar extends React.PureComponent {

  render() {
    const { isProfile } = this.props

    return (
      <ResponsiveClassesComponent
        classNames={[_s.d, _s.z4, _s.minH53PX, _s.w100PC].join(' ')}
        classNamesXS={[_s.d, _s.z4, _s.minH98PX, _s.w100PC].join(' ')}
      >
        <ResponsiveClassesComponent
          classNames={[_s.d, _s.minH53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')}
          classNamesXS={[_s.d, _s.minH98PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')}
        >

          <div className={[_s.d, _s.w1255PX, _s.flexRow, _s.flexWrap, _s.h100PC].join(' ')}>
          
            <ResponsiveClassesComponent
              classNames={[_s.d, _s.aiCenter, _s.jcCenter, _s.flexRow, _s.flexGrow1, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR].join(' ')}
              classNamesXS={[_s.d, _s.flexRow, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}
            >

              <Button
                href='/'
                color='none'
                backgroundColor='none'
                icon='logo'
                title='Gab'
                iconClassName={[_s.mr5, _s.fillBrand].join(' ')}
              />

              {
                isProfile &&
                <ResponsiveComponent min={BREAKPOINT_EXTRA_SMALL}>
                  <div className={[_s.d, _s.flexRow, _s.mr15].join(' ')}>
                    <NavigationBarButton title='Home' icon='home' href='/home' />
                    <NavigationBarButton title='Explore' icon='explore' to='/explore' />
                    <NavigationBarButton title='News' icon='news' to='/news' />
                  </div>
                </ResponsiveComponent>
              }

              <div className={[_s.d, _s.flexGrow1, _s.pr10, _s.mrAuto, _s.maxW640PX].join(' ')}>
                <Search isInNav />
              </div>

            </ResponsiveClassesComponent>

            <ResponsiveClassesComponent
              classNames={[_s.d, _s.flexRow, _s.py5, _s.px10, _s.w330PX, _s.mlAuto].join(' ')}
              classNamesXS={[_s.d, _s.flexRow, _s.pb5, _s.px10, _s.w100PC].join(' ')}
            >

              <Button
                isNarrow
                isOutline
                color='brand'
                backgroundColor='white'
                href='/auth/sign_in'
                className={[_s.borderColorWhite, _s.mr5, _s.flexGrow1, _s.aiCenter, _s.jcCenter, _s.py7].join(' ')}
              >
                <Text color='inherit' weight='medium' align='center'>
                  Log in
                </Text>
              </Button>

              <Button
                isNarrow
                color='white'
                backgroundColor='brand'
                href='/auth/sign_up'
                className={[_s.jcCenter, _s.aiCenter, _s.ml5, _s.flexGrow1, _s.py7].join(' ')}
              >
                <Text color='inherit' weight='bold' align='center'>
                  Sign up
                </Text>
              </Button>

            </ResponsiveClassesComponent>
          </div>

        </ResponsiveClassesComponent>
      </ResponsiveClassesComponent>
    )
  }

}

LoggedOutNavigationBar.propTypes = {
  isProfile: PropTypes.bool,
  title: PropTypes.string,
  showBackBtn: PropTypes.bool,
}

export default LoggedOutNavigationBar