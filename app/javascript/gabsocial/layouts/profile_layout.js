import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import classNames from 'classnames/bind'
import Sidebar from '../components/sidebar'
import Avatar from '../components/avatar'
import Image from '../components/image'
import Text from '../components/text'
import Button from '../components/button'
import DisplayName from '../components/display_name'
import TabBar from '../components/tab_bar'
import ProfileHeader from '../components/profile_header'

const cx = classNames.bind(_s)

export default class ProfileLayout extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map,
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { account, children, layout } = this.props

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC, _s.heightMin100VH, _s.backgroundColorSecondary3].join(' ')}>

        <Sidebar />

        <main role='main' className={[_s.default, _s.flexShrink1, _s.flexGrow1, _s.borderColorSecondary2, _s.borderLeft1PX].join(' ')}>

          <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.pl15, _s.py15].join(' ')}>
            <div className={[_s.default, _s.z1, _s.width100PC].join(' ')}>

              <ProfileHeader account={account} />

              <div className={[_s.default, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween, _s.pr15, _s.py15].join(' ')}>
                <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                  <div className={_s.default}>
                    {children}
                  </div>
                </div>

                <div className={[_s.default, _s.width340PX].join(' ')}>
                  <Sticky top={15} enabled>
                    <div className={[_s.default, _s.width340PX].join(' ')}>
                      {layout}
                    </div>
                  </Sticky>
                </div>
              </div>

            </div>
          </div>

        </main>

      </div>
    )
  }

}
