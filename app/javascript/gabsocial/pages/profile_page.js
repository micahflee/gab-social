import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchAccountByUsername } from '../actions/accounts'
import { makeGetAccount } from '../selectors'
import { me } from '../initial_state'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import ProfileStatsPanel from '../components/panel/profile_stats_panel'
import ProfileInfoPanel from '../components/panel/profile_info_panel'
import MediaGalleryPanel from '../components/panel/media_gallery_panel'
import ColumnIndicator from '../components/column_indicator'
import ProfileLayout from '../layouts/profile_layout'

const mapStateToProps = (state, { params: { username } }) => {
  const accounts = state.getIn(['accounts'])
  const account = accounts.find(acct => username.toLowerCase() === acct.getIn(['acct'], '').toLowerCase())

  const accountId = !!account ? account.get('id') : -1
  const isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false)
  const isLocked = state.getIn(['accounts', accountId, 'locked'], false)
  const isFollowing = state.getIn(['relationships', accountId, 'following'], false)

  const unavailable = (me === accountId) ? false : (isBlocked || (isLocked && !isFollowing))

  const getAccount = makeGetAccount()

  return {
    unavailable,
    account: accountId !== -1 ? getAccount(state, accountId) : null,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchAccountByUsername(username) {
    dispatch(fetchAccountByUsername(username))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends ImmutablePureComponent {

  static propTypes = {
    children: PropTypes.node,
    params: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    onFetchAccountByUsername: PropTypes.func.isRequired,
    unavailable: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.props.onFetchAccountByUsername(this.props.params.username)
  }

  render() {
    const {
      account,
      children,
      unavailable,
      params: { username },
    } = this.props

    const name = !!account ? account.get('display_name_html') : ''
    console.log("name:", name, account)

    return (
      <ProfileLayout
        account={account}
        layout={(
          <Fragment>
            <ProfileStatsPanel account={account} />
            <ProfileInfoPanel account={account} />
            { !unavailable && <MediaGalleryPanel account={account} /> }
            <LinkFooter />
          </Fragment>
        )}
      >
        <PageTitle path={`${name} (@${username})`} />
        {
          !account && <ColumnIndicator type='loading' />
        }
        {
          !!account && !unavailable &&
          React.cloneElement(children, {
            account,
          })
        }
      </ProfileLayout>
    )
  }

}