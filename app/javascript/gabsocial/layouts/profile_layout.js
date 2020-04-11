import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import Layout from './layout'
import ProfileHeader from '../components/profile_header'

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
    } = this.props

    return (
      <Layout
        noRightSidebar
        noHeader
        noComposeButton
      >

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

      </Layout>
    )
  }

}
