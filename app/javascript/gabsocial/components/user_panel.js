import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classNames from 'classnames/bind'
import { autoPlayGif, me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import { shortNumberFormat } from '../utils/numbers'
import Avatar from './avatar'

const messages = defineMessages({
  gabs: { id: 'account.posts', defaultMessage: 'Gabs' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Follows' }
})

const mapStateToProps = state => {
  const getAccount = makeGetAccount()

  return {
    account: getAccount(state, me),
  }
}

export default @connect(mapStateToProps)
@injectIntl
class UserPanel extends ImmutablePureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { account, intl } = this.props
    const displayNameHtml = { __html: account.get('display_name_html') }

    const statItems = [
      {
        to: `/${account.get('acct')}`,
        title: intl.formatMessage(messages.gabs),
        value: shortNumberFormat(account.get('statuses_count')),
      },
      {
        to: `/${account.get('acct')}/followers`,
        title: intl.formatMessage(messages.followers),
        value: shortNumberFormat(account.get('followers_count')),
      },
      {
        to: `/${account.get('acct')}/following`,
        title: intl.formatMessage(messages.follows),
        value: shortNumberFormat(account.get('following_count')),
      },
    ]

    return (
      <aside className={[styles.default, styles.backgroundWhite, styles.overflowHidden, styles.radiusSmall, styles.marginBottom15PX, styles.borderColorSubtle, styles.border1PX].join(' ')}>
        <div className={[styles.default].join(' ')}>

          <div className={[styles.default, styles.height122PX].join(' ')}>
            <img
              className={[styles.default, styles.image, styles.height122PX, styles.width100PC, styles.objectFitCover].join(' ')}
              src={autoPlayGif ? account.get('header') : account.get('header_static')}
              alt=''
            />
          </div>

          <div className={[styles.default, styles.positionRelative].join(' ')}>
            <NavLink
              className={[styles.default, styles.flexRow, styles.paddingVertical10PX, styles.paddingHorizontal15PX, styles.noUnderline].join(' ')}
              to={`/${account.get('acct')}`}
            >
              <div className={[styles.default, styles.marginTopNeg30PX, styles.circle, styles.borderColorWhite, styles.border2PX].join(' ')}>
                <Avatar account={account} size={62} />
              </div>
              <h1 className={[styles.default, styles.marginLeft15PX].join(' ')}>
                <span
                  className={[styles.default, styles.text, styles.displayBlock, styles.textOverflowEllipsis, styles.fontSize14PX, styles.colorBlack, styles.fontWeightBold].join(' ')}
                  dangerouslySetInnerHTML={displayNameHtml}
                />
                <small className={[styles.default, styles.text, styles.displayBlock, styles.textOverflowEllipsis, styles.fontWeightNormal, styles.fontSize14PX, styles.colorSubtle].join(' ')}>@{account.get('acct')}</small>
              </h1>
            </NavLink>
          </div>

          <div className={[styles.default, styles.marginBottom15PX, styles.marginTop5PX, styles.flexRow, styles.paddingHorizontal15PX].join(' ')}>
            {
              statItems.map((statItem, i) => (
                <UserPanelStatItem {...statItem} key={`user-panel-stat-item-${i}`} />
              ))
            }
          </div>
        </div>
      </aside>
    )
  }
}

class UserPanelStatItem extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { to, title, value } = this.props
    const { hovering } = this.state

    const cx = classNames.bind(styles)
    const titleClasses = cx({
      default: 1,
      fontWeightNormal: 1,
      text: 1,
      displayFlex: 1,
      fontSize13PX: 1,
      colorSubtle: !hovering,
      colorBlack: hovering,
      underline: hovering,
    })

    return (
      <NavLink
        to={to}
        title={`${value} ${title}`}
        className={[styles.default, styles.flexGrow1, styles.cursorPointer, styles.noUnderline, styles.paddingRight15PX].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <span
          className={[styles.default, styles.fontWeightBold, styles.text, styles.displayFlex, styles.fontSize19PX, styles.colorBrand].join(' ')}
        >
          {value}
        </span>
        <strong
          className={titleClasses}
        >
          {title}
        </strong>
      </NavLink>
    )
  }
}