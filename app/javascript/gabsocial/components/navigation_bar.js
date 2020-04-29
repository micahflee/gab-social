import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Responsive from '../features/ui/util/responsive_component'
import ColumnHeader from './column_header'
import Search from './search'
import Icon from './icon'

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

export default
@connect(mapStateToProps)
class NavigationBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    actions: PropTypes.array,
    tabs: PropTypes.array,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const {
      title,
      showBackBtn,
      actions,
      tabs,
      account,
    } = this.props

    const isPro = account.get('is_pro')

    return (
      <div className={[_s.default, _s.height53PX, _s.flexRow, _s.backgroundColorPrimary, _s.borderBottom1PX, _s.borderColorSecondary, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
        <div className={[_s.default, _s.flexGrow1, _s.z3, _s.alignItemsEnd].join(' ')}>
          <div className={[_s.default, _s.width240PX].join(' ')}>
            <div className={[_s.default, _s.height100PC, _s.alignItemsStart, _s.width240PX].join(' ')}>
              <h1 className={[_s.default].join(' ')}>
                <NavLink to='/' aria-label='Gab' className={[_s.default, _s.flexRow, _s.noSelect, _s.noUnderline, _s.height50PX, _s.cursorPointer, _s.px10].join(' ')}>
                  <Icon id='gab-logo' />
                </NavLink>
              </h1>
            </div>
          </div>
        </div>
        <div className={[_s.default, _s.flexShrink1, _s.flexGrow1].join(' ')}>
          <div className={[_s.default, _s.height53PX, _s.pl15, _s.width1015PX, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
            <div className={[_s.default, _s.width645PX].join(' ')}>
              <ColumnHeader
                title={title}
                showBackBtn={showBackBtn}
                actions={actions}
                tabs={tabs}
              />
            </div>
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <div className={[_s.default, _s.width340PX].join(' ')}>
                <Search />
              </div>
            </Responsive>
          </div>
        </div>
      </div>
    )
  }

}