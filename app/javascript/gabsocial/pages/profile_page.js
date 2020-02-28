import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchAccountByUsername } from '../actions/accounts'
import { makeGetAccount } from '../selectors'
import LinkFooter from '../components/link_footer'
import ProfileStatsPanel from '../components/panel/profile_stats_panel'
import ProfileInfoPanel from '../components/panel/profile_info_panel'
import MediaGalleryPanel from '../components/panel/media_gallery_panel'
import ProfileLayout from '../layouts/profile_layout'

const mapStateToProps = (state, { params: { username }, withReplies = false }) => {
  const accounts = state.getIn(['accounts'])
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() == username.toLowerCase())

  let account = null
  if (!accountFetchError) {
    account = accounts.find(acct => username.toLowerCase() == acct.getIn(['acct'], '').toLowerCase())
  }

  const getAccount = makeGetAccount()

  return {
    account: account ? getAccount(state, account.get('id')) : null,
  }
}

export default
@connect(mapStateToProps)
class ProfilePage extends ImmutablePureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  componentWillMount() {
    const { dispatch, params: { username } } = this.props
    dispatch(fetchAccountByUsername(username))
  }

  render() {
    const { account } = this.props

    return (
      <ProfileLayout
        account={account}
        layout={(
          <Fragment>
            <ProfileStatsPanel account={account} />
            <ProfileInfoPanel account={account} />
            <MediaGalleryPanel account={account} />
            <LinkFooter />
          </Fragment>
        )}
      >
        { this.props.children }
      </ProfileLayout>
    )
  }
}