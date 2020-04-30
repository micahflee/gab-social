import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import ProfileHeader from '../components/profile_header'
import NavigationBar from '../components/navigation_bar'

export default class ProfileLayout extends ImmutablePureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    account: ImmutablePropTypes.map,
    layout: PropTypes.object,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const {
      account,
      children,
      layout,
      title,
      showBackBtn,
    } = this.props

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <NavigationBar />

        <main role='main' className={[_s.default, _s.width100PC].join(' ')}>

          <div className={[_s.default, _s.width100PC, _s.flexRow, _s.pb15].join(' ')}>

            <div className={[_s.default, _s.width100PC, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
              <div className={[_s.default, _s.z1, _s.width100PC, _s.alignItemsCenter].join(' ')}>

                <ProfileHeader account={account} />

                <div className={[_s.default, _s.width1015PX,, _s.flexRow, _s.justifyContentEnd, _s.py15].join(' ')}>
                  <div className={[_s.default, _s.width340PX, _s.mr15].join(' ')}>
                    <Sticky top={63} enabled>
                      <div className={[_s.default, _s.width340PX].join(' ')}>
                        {layout}
                      </div>
                    </Sticky>
                  </div>
                  <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                    <div className={_s.default}>
                      {children}
                    </div>
                  </div>
                </div>

              </div>
            </div>


          </div>

        </main>

      </div>
    )
  }

}
