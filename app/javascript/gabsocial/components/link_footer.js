import moment from 'moment'
import classNames from 'classnames/bind'
import {
  defineMessages,
  injectIntl,
} from 'react-intl'
import { openModal } from '../actions/modal'
import {
  version,
  repository,
  source_url,
  me,
} from '../initial_state'

const messages = defineMessages({
  invite: { id: 'getting_started.invite', defaultMessage: 'Invite people' },
  hotkeys: { id: 'navigation_bar.keyboard_shortcuts', defaultMessage: 'Hotkeys' },
  security: { id: 'getting_started.security', defaultMessage: 'Security' },
  about: { id: 'navigation_bar.info', defaultMessage: 'About' },
  developers: { id: 'getting_started.developers', defaultMessage: 'Developers' },
  terms: { id: 'getting_started.terms', defaultMessage: 'Terms of Service' },
  dmca: { id: 'getting_started.dmca', defaultMessage: 'DMCA' },
  terms: { id: 'getting_started.terms_of_sale', defaultMessage: 'Terms of Sale' },
  privacy: { id: 'getting_started.privacy', defaultMessage: 'Privacy Policy' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  notice: { id: 'getting_started.open_source_notice', defaultMessage: 'Gab Social is open source software. You can contribute or report issues on our self-hosted GitLab at {gitlab}.' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'))
  },
})

export default @connect(null, mapDispatchToProps)
@injectIntl
class LinkFooter extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenHotkeys: PropTypes.func.isRequired,
  }

  state = {
    hoveringItemIndex: null,
  }

  onMouseEnterLinkFooterItem = (i) => {
    this.setState({
      hoveringItemIndex: i,
    })
  }

  onMouseLeaveLinkFooterItem = () => {
    this.setState({
      hoveringItemIndex: null,
    })
  }

  render() {
    const { onOpenHotkeys, intl } = this.props
    const { hoveringItemIndex } = this.state

    const cx = classNames.bind(styles);

    const currentYear = moment().format('YYYY')

    const linkFooterItems = [
      {
        to: '#',
        onClick: onOpenHotkeys,
        text: intl.formatMessage(messages.hotkeys),
        requiresUser: true,
      },
      {
        to: '/auth/edit',
        text: intl.formatMessage(messages.security),
        requiresUser: true,
      },
      {
        to: '/about',
        text: intl.formatMessage(messages.about),
      },
      {
        to: '/settings/applications',
        text: intl.formatMessage(messages.developers),
      },
      {
        to: '/about/tos',
        text: intl.formatMessage(messages.terms),
      },
      {
        to: '/about/dmca',
        text: intl.formatMessage(messages.dmca),
      },
      {
        to: '/about/sales',
        text: intl.formatMessage(messages.terms),
      },
      {
        to: '/about/privacy',
        text: intl.formatMessage(messages.privacy),
      },
      {
        to: '/auth/sign_out',
        text: intl.formatMessage(messages.logout),
        requiresUser: true,
        logout: true,
      },
    ]

    return (
      <div className={styles.default}>
        <nav aria-label='Footer' role='navigation' className={[styles.default, styles.flexWrap, styles.flexRow].join(' ')}>
          {
            linkFooterItems.map((linkFooterItem, i) => {
              if (linkFooterItem.requiresUser && !me) return null
              const classes = cx({
                default: 1,
                fontSize13PX: 1,
                text: 1,
                marginVertical5PX: 1,
                paddingRight15PX: 1,
                colorSubtle: i !== hoveringItemIndex,
                noUnderline: i !== hoveringItemIndex,
                colorBlack: i === hoveringItemIndex,
                underline: i === hoveringItemIndex,
              })
              return (
                <a
                  key={`link-footer-item-${i}`}
                  href={linkFooterItem.to}
                  data-method={linkFooterItem.logout ? 'delete' : null}
                  onClick={linkFooterItem.onClick || null}
                  onMouseEnter={() => this.onMouseEnterLinkFooterItem(i)}
                  onMouseLeave={() => this.onMouseLeaveLinkFooterItem(i)}
                  className={classes}
                >
                  {linkFooterItem.text}
                </a>
              )
            })
          }
        </nav>

        <p>
          {intl.formatMessage(messages.invite, {
            gitlab: (
              <span>
                <a href={source_url} rel='noopener' target='_blank'>{repository}</a>
                (v{version})
              </span>
            )
          })}
        </p>
        <p>© {currentYear} Gab AI Inc.</p>
      </div>
    )
  }

}