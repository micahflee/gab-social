import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import LinkFooter from '../components/link_footer'
import ProfileInfoPanel from '../components/panel/profile_info_panel'
import MediaGalleryPanel from '../components/panel/media_gallery_panel'
import ProfileLayout from '../layouts/profile_layout'

const mapStateToProps = (state, { params: { username }, withReplies = false }) => {
  const accounts = state.getIn(['accounts'])
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() == username.toLowerCase())

  let accountId = -1
  let account = null
  let accountUsername = username
  if (accountFetchError) {
    accountId = null
  }
  else {
    account = accounts.find(acct => username.toLowerCase() == acct.getIn(['acct'], '').toLowerCase())
    accountId = account ? account.getIn(['id'], null) : -1
    accountUsername = account ? account.getIn(['acct'], '') : ''
  }

  //Children components fetch information

  return {
    account,
    accountId,
    accountUsername,
  }
}

export default
@connect(mapStateToProps)
class ProfilePage extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map,
    accountUsername: PropTypes.string.isRequired,
    accountId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    children: PropTypes.node,
  }

  render() {
    const { accountId, account, accountUsername } = this.props

    return (
      <ProfileLayout
        account={account}
        layout={(
          <Fragment>
            <ProfileInfoPanel />
            <MediaGalleryPanel />
            <LinkFooter />
          </Fragment>
        )}
      >
        { /* this.props.children */ }
      </ProfileLayout>
    )
  }
}