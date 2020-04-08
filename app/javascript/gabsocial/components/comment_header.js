import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Avatar from './avatar'
import Button from './button'
import DisplayName from './display_name'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'

export default
@injectIntl
class CommentHeader extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { status } = this.props

    const repostCount = status.get('reblogs_count')
    const favoriteCount = status.get('favourites_count')

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;

    return (
      <div className={[_s.default, _s.alignItemsStart, _s.flexGrow1].join(' ')}>

        <div className={[_s.default, _s.flexRow, _s.width100PC, _s.alignItemsCenter].join(' ')}>
          <NavLink
            className={[_s.default, _s.flexRow, _s.alignItemsStart, _s.noUnderline].join(' ')}
            to={`/${status.getIn(['account', 'acct'])}`}
            title={status.getIn(['account', 'acct'])}
          >
            <DisplayName account={status.get('account')} small />
          </NavLink>

          {
            status.get('revised_at') !== null &&
            <Fragment>
              <DotTextSeperator />
              <Button
                text
                underlineOnHover
                backgroundColor='none'
                color='tertiary'
                onClick={this.handleOpenStatusEdits}
                className={_s.ml5}
              >
                <Text size='extraSmall' color='inherit'>
                  Edited
                </Text>
              </Button>
            </Fragment>
          }

          {
            favoriteCount > 0 &&
            <Fragment>
              <DotTextSeperator />
                <Button
                  text
                  underlineOnHover
                  backgroundColor='none'
                  color='tertiary'
                  to={statusUrl}
                  className={_s.ml5}
                >
                <Text size='extraSmall' color='inherit'>
                  {favoriteCount}
                  &nbsp;Likes
                </Text>
              </Button>
            </Fragment>
          }

          {
            repostCount > 0 &&
            <Fragment>
              <DotTextSeperator />
                <Button
                  text
                  underlineOnHover
                  backgroundColor='none'
                  color='tertiary'
                  to={statusUrl}
                  className={_s.ml5}
                >
                <Text size='extraSmall' color='inherit'>
                  {repostCount}
                  &nbsp;Reposts
                </Text>
              </Button>
            </Fragment>
          }

          <DotTextSeperator />

          <Button
            text
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
