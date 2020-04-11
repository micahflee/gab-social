import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../../../components/avatar';
import Button from '../../../../components/button'
import { me } from '../../../../initial_state';

const mapStateToProps = (state) => ({
  account: state.getIn(['accounts', me]),
})

export default
@connect(mapStateToProps)
class NavigationBar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onClose: PropTypes.func,
  };

  render () {
    const { account } = this.props;

    return (
      <div className='navigation-bar'>
        <Button href={account.get('url')} to={`/${account.get('acct')}`}>
          <span style={{ display: 'none' }}>{account.get('acct')}</span>
          <Avatar account={account} size={48} />
        </Button>

        <div className='navigation-bar__profile'>
          <Button href={account.get('url')} to={`/${account.get('acct')}`}>
            <strong className='navigation-bar__profile-account'>@{account.get('acct')}</strong>
          </Button>

          <a href='/settings/profile' className='navigation-bar__profile-edit'>
            <FormattedMessage id='navigation_bar.edit_profile' defaultMessage='Edit profile' />
          </a>
        </div>

        <div className='navigation-bar__actions'>
          <Button className='close' title='' icon='close' onClick={this.props.onClose} />
        </div>
      </div>
    );
  }

}
