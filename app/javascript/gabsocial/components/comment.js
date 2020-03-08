import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { makeGetStatus } from '../selectors';
import CommentHeader from './comment_header'
import Avatar from './avatar'
import Button from './button'
import DisplayName from './display_name'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'
import StatusContent from './status_content'

const messages = defineMessages({
  follow: { id: 'follow', defaultMessage: 'Follow' },
})

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => ({
    status: getStatus(state, props),
  });

  return mapStateToProps;
};

export default
@injectIntl
@connect(makeMapStateToProps)
class Comment extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
  }

  handleClick = () => {
    // if (this.props.onClick) {
    //   this.props.onClick();
    //   return;
    // }

    // if (!this.context.router) return;

    // this.context.router.history.push(
    //   `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
    // )
  }

  render() {
    const { status } = this.props

    console.log("status:", status)

    return (
      <div className={[_s.default, _s.paddingHorizontal10PX, _s.marginBottom10PX, _s.paddingVertical5PX].join(' ')} data-comment={status.get('id')}>
        <div className={[_s.default].join(' ')}>

          <div className={[_s.default, _s.flexRow].join(' ')}>
            <NavLink
              to={`/${status.getIn(['account', 'acct'])}`}
              title={status.getIn(['account', 'acct'])}
              className={[_s.default, _s.marginRight10PX, _s.paddingTop5PX].join(' ')}
            >
              <Avatar account={status.get('account')} size={32} />
            </NavLink>

            <div className={[_s.default, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.paddingHorizontal10PX, _s.paddingVertical5PX, _s.radiusSmall, _s.backgroundSubtle].join(' ')}>
                <div className={_s.paddingTop2PX}>
                  <CommentHeader status={status} />
                </div>
                <div className={[_s.paddingVertical5PX].join(' ')}>
                  <StatusContent
                    status={status}
                    onClick={this.handleClick}
                    isComment
                    collapsable
                  />
                </div>
              </div>
              <div className={[_s.default, _s.flexRow, _s.marginTop5PX].join(' ')}>
                
                <Button
                  text
                  radiusSmall
                  backgroundColor='none'
                  color='tertiary'
                  className={[_s.paddingHorizontal5PX, _s.backgroundSubtle_onHover, _s.paddingVertical2PX, _s.marginRight5PX].join(' ')}
                >
                  <Text size='extraSmall' color='inherit' weight='bold'>
                    Like
                  </Text>
                </Button>

                <Button
                  text
                  radiusSmall
                  backgroundColor='none'
                  color='tertiary'
                  className={[_s.paddingHorizontal5PX, _s.backgroundSubtle_onHover, _s.paddingVertical2PX, _s.marginRight5PX].join(' ')}
                >
                  <Text size='extraSmall' color='inherit' weight='bold'>
                    Reply
                  </Text>
                </Button>

                <Button
                  text
                  radiusSmall
                  backgroundColor='none'
                  color='tertiary'
                  className={[_s.paddingHorizontal5PX, _s.backgroundSubtle_onHover, _s.paddingVertical2PX, _s.marginRight5PX].join(' ')}
                >
                  <Text size='extraSmall' color='inherit' weight='bold'>
                    ···
                  </Text>
                </Button>

              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

}
