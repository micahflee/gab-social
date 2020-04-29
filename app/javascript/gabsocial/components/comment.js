import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { makeGetStatus } from '../selectors';
import Avatar from './avatar'
import Button from './button'
import CommentHeader from './comment_header'
import StatusContent from './status_content'
import Text from './text'

const messages = defineMessages({
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  like: { id: 'status.like', defaultMessage: 'Like' },
})

const makeMapStateToProps = (state, props) => ({
  status: makeGetStatus()(state, props)
})

export default
@injectIntl
@connect(makeMapStateToProps)
class Comment extends ImmutablePureComponent {

  static propTypes = {
    indent: PropTypes.number,
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map.isRequired,
  }

  updateOnProps = [
    'status',
    'indent',
  ]

  render() {
    const {
      indent,
      intl,
      status,
    } = this.props

    const style = {
      paddingLeft: `${indent * 40}px`,
    }

    // : todo : add media

    return (
      <div className={[_s.default, _s.px15, _s.mb10, _s.py5].join(' ')} data-comment={status.get('id')}>
        <div className={[_s.default].join(' ')} style={style}>

          <div className={[_s.default, _s.flexRow].join(' ')}>
            <NavLink
              to={`/${status.getIn(['account', 'acct'])}`}
              title={status.getIn(['account', 'acct'])}
              className={[_s.default, _s.mr10, _s.pt5].join(' ')}
            >
              <Avatar account={status.get('account')} size={32} />
            </NavLink>

            <div className={[_s.default, _s.flexNormal].join(' ')}>
              <div className={[_s.default, _s.px10, _s.pt5, _s.pb10, _s.radiusSmall, _s.bgSubtle].join(' ')}>
                <CommentHeader status={status} />
                <StatusContent
                  status={status}
                  onClick={this.handleClick}
                  isComment
                  collapsable
                />
              </div>

              <div className={[_s.default, _s.flexRow, _s.mt5].join(' ')}>
                <CommentButton title={intl.formatMessage(messages.like)} />
                <CommentButton title={intl.formatMessage(messages.reply)} />
                <CommentButton title='···' />
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }

}

class CommentButton extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const { onClick, title } = this.props

    return (
      <Button
        isText
        radiusSmall
        backgroundColor='none'
        color='tertiary'
        className={[_s.px5, _s.bgSubtle_onHover, _s.py2, _s.mr5].join(' ')}
        onClick={onClick}
      >
        <Text size='extraSmall' color='inherit' weight='bold'>
          {title}
        </Text>
      </Button>
    )
  }

}