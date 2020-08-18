import React from 'react'
import Block from '../components/block'
import Icon from '../components/icon'
import BundleColumnError from '../components/bundle_column_error'
import Bundle from '../features/ui/util/bundle'
import { Introduction } from '../features/ui/util/async_components'

export default class IntroductionLayout extends React.PureComponent {

  renderError = (props) => {
    return <BundleColumnError {...props} />
  }

  render() {
    return (
      <div className={[_s.d, _s.w100PC, _s.minH100VH, _s.bgTertiary].join(' ')}>

        <div className={[_s.d, _s.z4, _s.minH53PX, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.minH53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
            <div className={[_s.d, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.flexRow, _s.w1255PX].join(' ')}>
              <div className={[_s.d, _s.flexRow].join(' ')}>

                <h1 className={[_s.d, _s.mr15].join(' ')}>
                  <div className={[_s.d, _s.jcCenter, _s.noSelect, _s.noUnderline, _s.h53PX, _s.px10, _s.mr15].join(' ')}>
                    <Icon id='logo' className={_s.fillNavigationBrand} />
                  </div>
                </h1>

              </div>
            </div>
          </div>
        </div>

        <div className={[_s.d, _s.flexRow, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.w100PC].join(' ')}>
            <main role='main'>
              <div className={[_s.d, _s.aiCenter, _s.py15, _s.px15, _s.mlAuto, _s.mrAuto].join(' ')}>

                <div className={[_s.d, _s.w645PX, _s.maxW100PC42PX].join(' ')}>
                  <Block>
                    <Bundle fetchComponent={Introduction} error={this.renderError}>
                      {Component => (<Component />)}
                    </Bundle>
                  </Block>
                </div>

              </div>
            </main>
          </div>
        </div>

      </div>
    )
  }

}
