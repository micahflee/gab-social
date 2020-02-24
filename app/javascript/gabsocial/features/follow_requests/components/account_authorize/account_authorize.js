import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { authorizeFollowRequest, rejectFollowRequest } from '../../../../actions/accounts';
import { makeGetAccount } from '../../../../selectors';
import Button from '../../../../components/button'
import Avatar from '../../../../components/avatar';
import DisplayName from '../../../../components/display_name';
import IconButton from '../../../../components/icon_button';

const messages = defineMessages({
  authorize: { id: 'follow_request.authorize', defaultMessage: 'Authorize' },
  reject: { id: 'follow_request.reject', defaultMessage: 'Reject' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, props) => ({
    account: getAccount(state, props.id),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { id }) => ({
  onAuthorize() {
    dispatch(authorizeFollowRequest(id));
  },

  onReject() {
    dispatch(rejectFollowRequest(id));
  },
});

export default @connect(makeMapStateToProps, mapDispatchToProps)
@injectIntl
class AccountAuthorize extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { intl, account, onAuthorize, onReject } = this.props;
    const content = { __html: account.get('note_emojified') };

    return (
      <div className='account-authorize__wrapper'>
        <div className='account-authorize'>
          <Button href={`/${account.get('acct')}`} to={`/${account.get('acct')}`} className='account-authorize__display-name'>
            <div className='account-authorize__avatar'>
              <Avatar account={account} size={48} />
            </div>
            <DisplayName account={account} />
          </Button>

          <div className='account__header__content' dangerouslySetInnerHTML={content} />
        </div>

        <div className='account--panel'>
          <div className='account--panel__button'>
            <IconButton title={intl.formatMessage(messages.authorize)} icon='check' onClick={onAuthorize} />
          </div>
          <div className='account--panel__button'>
            <IconButton title={intl.formatMessage(messages.reject)} icon='times' onClick={onReject} />
          </div>
        </div>
      </div>
    );
  }

}
