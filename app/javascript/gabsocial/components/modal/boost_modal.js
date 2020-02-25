import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import Button from '../button';
import StatusContent from '../status_content';
import Avatar from '../avatar';
import RelativeTimestamp from '../relative_timestamp';
import DisplayName from '../display_name';
import Icon from '../icon';

const messages = defineMessages({
  cancel_reblog: { id: 'status.cancel_reblog_private', defaultMessage: 'Un-repost' },
  reblog: { id: 'status.reblog', defaultMessage: 'Repost' },
  combo: { id: 'boost_modal.combo', defaultMessage: 'You can press {combo} to skip this next time' },
});

export default
@injectIntl
class BoostModal extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onReblog: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.button.focus();
  }

  handleReblog = () => {
    this.props.onReblog(this.props.status);
    this.props.onClose();
  }

  handleAccountClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.onClose();
      this.context.router.history.push(`/${this.props.status.getIn(['account', 'acct'])}`);
    }
  }

  handleStatusClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.onClose();
      this.context.router.history.push(`/${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('url')}`);
    }
  }

  setRef = (c) => {
    this.button = c;
  }

  render () {
    const { status, intl } = this.props;
    const buttonText = status.get('reblogged') ? messages.cancel_reblog : messages.reblog;

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('url')}`;

    return (
      <div className='modal-root__modal boost-modal'>
        <div className='boost-modal__container'>
          <div className='status light'>
            <div className='boost-modal__status-header'>
              <div className='boost-modal__status-time'>
                <a onClick={this.handleStatusClick} href={statusUrl} className='status__relative-time'>
                  <RelativeTimestamp timestamp={status.get('created_at')} />
                </a>
              </div>

              <a onClick={this.handleAccountClick} href={`/${status.getIn(['account', 'acct'])}`} className='status__display-name'>
                <div className='status__avatar'>
                  <Avatar account={status.get('account')} size={48} />
                </div>

                <DisplayName account={status.get('account')} />
              </a>
            </div>

            <StatusContent status={status} />
          </div>
        </div>

        <div className='boost-modal__action-bar'>
          <div>
            {intl.formatMessage(messages.combo, {
              values: {
                combo: <span>Shift + <Icon id='retweet' /></span>
              }
            })}
          </div>
          <Button text={intl.formatMessage(buttonText)} onClick={this.handleReblog} ref={this.setRef} />
        </div>
      </div>
    );
  }

}
