import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Button from './button'
import DisplayName from './display_name'
import DotTextSeperator from './dot_text_seperator'
import Icon from './icon'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'

const messages = defineMessages({
  edited: { id: 'status.edited', defaultMessage: 'Edited' },
  likesLabel: { id: 'likes.label', defaultMessage: '{number, plural, one {# like} other {# likes}}' },
  repostsLabel: { id: 'reposts.label', defaultMessage: '{number, plural, one {# repost} other {# reposts}}' },
})

export default
@injectIntl
class CommentHeader extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    ancestorAccountId: PropTypes.string.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    openLikesList: PropTypes.func.isRequired,
    openRepostsList: PropTypes.func.isRequired,
  }

  openLikesList = () => {
    this.props.onOpenLikes(this.props.status)
  }

  openRepostsList = () => {
    this.props.onOpenReposts(this.props.status)
  }

  render() {
    const {
      intl,
      status,
      ancestorAccountId,
    } = this.props

    if (!status) return null

    const repostCount = status.get('reblogs_count')
    const favoriteCount = status.get('favourites_count')

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;
    const isOwner = ancestorAccountId === status.getIn(['account', 'id'])

    return (
      <div className={[_s.default, _s.alignItemsStart, _s.py2, _s.flexGrow1].join(' ')}>

        <div className={[_s.default, _s.flexRow, _s.width100PC, _s.alignItemsCenter].join(' ')}>
          <NavLink
            className={[_s.default, _s.flexRow, _s.alignItemsStart, _s.noUnderline].join(' ')}
            to={`/${status.getIn(['account', 'acct'])}`}
            title={status.getIn(['account', 'acct'])}
          >
            <DisplayName account={status.get('account')} isSmall />
          </NavLink>

          {
            isOwner &&
            <div className={[_s.default, _s.alignItemsCenter, _s.ml5].join(' ')}>
              <span className={_s.visiblyHidden}>
                Original Gabber
              </span>
              <Icon id='mic' size='10px' className={_s.fillBrand} />
            </div>
          }

          {
            status.get('revised_at') !== null &&
            <Fragment>
              <DotTextSeperator />
              <Button
                isText
                underlineOnHover
                backgroundColor='none'
                color='tertiary'
                onClick={this.handleOpenStatusEdits}
                className={_s.ml5}
              >
                <Text size='extraSmall' color='inherit'>
                  {intl.formatMessage(messages.edited)}
                </Text>
              </Button>
            </Fragment>
          }

          {
            favoriteCount > 0 &&
            <Fragment>
              <DotTextSeperator />
                <Button
                  isText
                  underlineOnHover
                  backgroundColor='none'
                  color='tertiary'
                  className={_s.ml5}
                  onClick={this.openLikesList}
                >
                <Text size='extraSmall' color='inherit'>
                  {intl.formatMessage(messages.likesLabel, {
                    number: favoriteCount,
                  })}
                </Text>
              </Button>
            </Fragment>
          }

          {
            repostCount > 0 &&
            <Fragment>
              <DotTextSeperator />
                <Button
                  isText
                  underlineOnHover
                  backgroundColor='none'
                  color='tertiary'
                  className={_s.ml5}
                  onClick={this.openRepostsList}
                >
                <Text size='extraSmall' color='inherit'>
                  {intl.formatMessage(messages.repostsLabel, {
                    number: repostCount,
                  })}
                </Text>
              </Button>
            </Fragment>
          }

          <DotTextSeperator />

          <Button
            isText
            underlineOnHover
            backgroundColor='none'
            color='tertiary'
            to={statusUrl}
            className={_s.ml5}
          >
            <Text size='extraSmall' color='inherit'>
              <RelativeTimestamp timestamp={status.get('created_at')} />
            </Text>
          </Button>

        </div>
      </div>
    )
  }

}
