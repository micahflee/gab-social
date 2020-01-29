import { Link } from 'react-router-dom';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { autoPlayGif, me } from '../../initial_state';
import { makeGetAccount } from '../../selectors';
import { shortNumberFormat } from '../../utils/numbers';
import Avatar from '../avatar';

import './user_panel.scss';

const messages = defineMessages({
  gabs: { id:'account.posts', defaultMessage: 'Gabs' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' }
});


const mapStateToProps = state => {
  const getAccount = makeGetAccount();

  return {
    account: getAccount(state, me),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class UserPanel extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { account, intl } = this.props;
    const displayNameHtml = { __html: account.get('display_name_html') };

    return (
      <div className='user-panel'>
        <div className='user-panel__container'>

          <div className='user-panel__header'>
            <img src={autoPlayGif ? account.get('header') : account.get('header_static')} alt='' />
          </div>

          <div className='user-panel__profile'>
            <Link to={`/${account.get('acct')}`} title={account.get('acct')}>
              <Avatar account={account} />
            </Link>
          </div>

          <div className='user-panel__meta'>

            <div className='user-panel__account'>
              <h1>
                <Link to={`/${account.get('acct')}`}>
                  <span className='user-panel__account__name' dangerouslySetInnerHTML={displayNameHtml} />
                  <small className='user-panel__account__username'>@{account.get('acct')}</small>
                </Link>
              </h1>
            </div>

            <div className='user-panel__stats-block'>

              <div className='user-panel-stats-item'>
                <Link to={`/${account.get('acct')}`} title={intl.formatNumber(account.get('statuses_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('statuses_count'))}</strong>
                  <span className='user-panel-stats-item__label'>{intl.formatMessage(messages.gabs)}</span>
                </Link>
              </div>

              <div className='user-panel-stats-item'>
                <Link to={`/${account.get('acct')}/followers`} title={intl.formatNumber(account.get('followers_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('followers_count'))}</strong>
                  <span className='user-panel-stats-item__label'>{intl.formatMessage(messages.followers)}</span>
                </Link>
              </div>

              <div className='user-panel-stats-item'>
                <Link to={`/${account.get('acct')}/following`} title={intl.formatNumber(account.get('following_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('following_count'))}</strong>
                  <span className='user-panel-stats-item__label'>{intl.formatMessage(messages.follows)}</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    )
  }
};
