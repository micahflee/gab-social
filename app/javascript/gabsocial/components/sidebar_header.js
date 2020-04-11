import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import Icon from './icon'
import SidebarSectionItem from './sidebar_section_item'
import Text from './text'

const mapStateToProps = (state) => {
  const getAccount = makeGetAccount()

  return {
    account: getAccount(state, me),
  }
}

export default
@connect(mapStateToProps)
class SidebarHeader extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
  }

  render() {
    const { account } = this.props

    const isPro = account.get('is_pro')

    return (
      <Fragment>
        <h1 className={[_s.default].join(' ')}>
          <NavLink to='/' aria-label='Gab' className={[_s.default, _s.flexRow, _s.noSelect, _s.noUnderline, _s.height50PX, _s.cursorPointer, _s.px10].join(' ')}>
            <Icon id='gab-logo' className={_s.fillColorBrand} />
            {
              isPro &&
              <Text weight='bold' color='brand' size='extraSmall' className={[_s.pb5].join(' ')}>
                PRO
              </Text>
            }
          </NavLink>
        </h1>

        {
          (!!me && !!account) &&
          <SidebarSectionItem
            image={account.get('avatar')}
            title={account.get('acct')}
            to={`/${account.get('acct')}`}
          />
        }
      </Fragment>
    )
  }
}