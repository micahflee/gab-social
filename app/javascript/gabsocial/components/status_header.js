import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classNames from 'classnames/bind'
import { openPopover } from '../actions/popover'
import { openModal } from '../actions/modal'
import RelativeTimestamp from './relative_timestamp'
import DisplayName from './display_name'
import Text from './text'
import DotTextSeperator from './dot_text_seperator'
import Icon from './icon'
import Button from './button'
import Avatar from './avatar'

const cx = classNames.bind(_s)

const mapDispatchToProps = (dispatch) => ({
  onOpenStatusRevisionsPopover(status) {
    dispatch(openModal('STATUS_REVISIONS', {
      status,
    }))
  },

  onOpenStatusOptionsPopover(targetRef, status) {
    dispatch(openPopover('STATUS_OPTIONS', {
      targetRef,
      status,
      position: 'top',
    }))
  },
})

export default
@connect(null, mapDispatchToProps)
class StatusHeader extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    onOpenStatusRevisionsPopover: PropTypes.func.isRequired,
    onOpenStatusOptionsPopover: PropTypes.func.isRequired,
    reduced: PropTypes.bool,
  }

  handleOpenStatusOptionsPopover = () => {
    this.props.onOpenStatusOptionsPopover(this.statusOptionsButton, this.props.status)
  }

  handleOpenStatusEdits = () => {
    this.props.onOpenStatusRevisionsPopover(this.props.status)
  }

  handleDeleteClick = () => {
    this.props.onDelete(this.props.status, this.context.router.history);
  }

  handleEditClick = () => {
    this.props.onEdit(this.props.status);
  }

  handlePinClick = () => {
    this.props.onPin(this.props.status);
  }

  handleMentionClick = () => {
    this.props.onMention(this.props.status.get('account'), this.context.router.history);
  }

  handleMuteClick = () => {
    this.props.onMute(this.props.status.get('account'));
  }

  handleBlockClick = () => {
    this.props.onBlock(this.props.status);
  }

  handleOpen = () => {
    this.context.router.history.push(`/${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('id')}`);
  }

  handleEmbed = () => {
    this.props.onEmbed(this.props.status);
  }

  handleReport = () => {
    this.props.onReport(this.props.status);
  }

  handleConversationMuteClick = () => {
    this.props.onMuteConversation(this.props.status);
  }

  handleCopy = () => {
    const url = this.props.status.get('url');
    const textarea = document.createElement('textarea');

    textarea.textContent = url;
    textarea.style.position = 'fixed';

    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
    } catch (e) {
      //
    } finally {
      document.body.removeChild(textarea);
    }
  }

  handleGroupRemoveAccount = () => {
    const { status } = this.props;

    this.props.onGroupRemoveAccount(status.getIn(['group', 'id']), status.getIn(['account', 'id']));
  }

  handleGroupRemovePost = () => {
    const { status } = this.props;

    this.props.onGroupRemoveStatus(status.getIn(['group', 'id']), status.get('id'));
  }

  setStatusOptionsButton = n => {
    this.statusOptionsButton = n
  }

  render() {
    const { status, reduced } = this.props

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;

    const containerClasses = cx({
      default: 1,
      px15: 1,
      py10: !reduced,
      pb10: reduced,
    })

    const avatarSize = reduced ? 20 : 46
    const visibilityIcon = 'globe'

    return (
      <div className={containerClasses}>
        <div className={[_s.default, _s.flexRow, _s.mt5].join(' ')}>

          {
            !reduced &&
            <NavLink
              to={`/${status.getIn(['account', 'acct'])}`}
              title={status.getIn(['account', 'acct'])}
              className={[_s.default, _s.mr10].join(' ')}
            >
              <Avatar account={status.get('account')} size={avatarSize} />
            </NavLink>
          }

          <div className={[_s.default, _s.alignItemsStart, _s.flexGrow1, _s.mt5].join(' ')}>

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.alignItemsStart].join(' ')}>
              <NavLink
                className={[_s.default, _s.flexRow, _s.alignItemsStart, _s.noUnderline].join(' ')}
                to={`/${status.getIn(['account', 'acct'])}`}
                title={status.getIn(['account', 'acct'])}
              >
                <DisplayName account={status.get('account')} />
              </NavLink>

              {
                !reduced &&
                <Button
                  text
                  backgroundColor='none'
                  color='none'
                  icon='ellipsis'
                  iconWidth='20px'
                  iconHeight='20px'
                  iconClassName={_s.fillColorSecondary}
                  className={_s.marginLeftAuto}
                  onClick={this.handleOpenStatusOptionsPopover}
                  buttonRef={this.setStatusOptionsButton}
                />
              }
            </div>

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.lineHeight15].join(' ')}>
              <Button
                text
                underlineOnHover
                backgroundColor='none'
                color='none'
                to={statusUrl}
              >
                <Text size='small' color='secondary'>
                  <RelativeTimestamp timestamp={status.get('created_at')} />
                </Text>
              </Button>

              <DotTextSeperator />

              <Icon id={visibilityIcon} width='12px' height='12px' className={[_s.default, _s.displayInline, _s.ml5, _s.fillColorSecondary].join(' ')} />

              {
                !!status.get('group') &&
                <Fragment>
                  <DotTextSeperator />
                  <Button
                    text
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    to={`/groups/${status.getIn(['group', 'id'])}`}
                    className={_s.ml5}
                  >
                    <Text size='small' color='secondary'>
                      {status.getIn(['group', 'title'])}
                    </Text>
                  </Button>
                </Fragment>
              }

              {
                status.get('revised_at') !== null &&
                <Fragment>
                  <DotTextSeperator />
                  <Button
                    text
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    onClick={this.handleOpenStatusEdits}
                    className={_s.ml5}
                  >
                    <Text size='small' color='secondary'>
                      Edited
                    </Text>
                  </Button>
                </Fragment>
              }

            </div>
          </div>
        </div>
      </div>
    )
  }

}
