import moment from 'moment'
import classNames from 'classnames/bind'
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
} from 'react-intl'
import { openModal } from '../actions/modal'
import {
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
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'))
  },
})

const cx = classNames.bind(_s)
const currentYear = moment().format('YYYY')

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
      <div className={[_s.default, _s.paddingHorizontal10PX].join(' ')}>
        <nav aria-label='Footer' role='navigation' className={[_s.default, _s.flexWrap, _s.flexRow].join(' ')}>
          {
            linkFooterItems.map((linkFooterItem, i) => {
              if (linkFooterItem.requiresUser && !me) return null
              const classes = cx({
                default: 1,
                fontSize13PX: 1,
                text: 1,
                marginVertical5PX: 1,
                paddingRight15PX: 1,
                cursorPointer: 1,
                backgroundTransparent: 1,
                colorSecondary: i !== hoveringItemIndex,
                noUnderline: i !== hoveringItemIndex,
                colorPrimary: i === hoveringItemIndex,
                underline: i === hoveringItemIndex,
              })

              if (linkFooterItem.onClick) {
                return (
                  <button
                    key={`link-footer-item-${i}`}
                    data-method={linkFooterItem.logout ? 'delete' : null}
                    onClick={linkFooterItem.onClick || null}
                    onMouseEnter={() => this.onMouseEnterLinkFooterItem(i)}
                    onMouseLeave={() => this.onMouseLeaveLinkFooterItem(i)}
                    className={classes}
                  >
                    {linkFooterItem.text}
                  </button>
                )
              }

              return (
                <a
                  key={`link-footer-item-${i}`}
                  href={linkFooterItem.to}
                  data-method={linkFooterItem.logout ? 'delete' : null}
                  onMouseEnter={() => this.onMouseEnterLinkFooterItem(i)}
                  onMouseLeave={() => this.onMouseLeaveLinkFooterItem(i)}
                  className={classes}
                >
                  {linkFooterItem.text}
                </a>
              )
            })
          }
          <span className={[_s.default, _s.text, _s.fontSize13PX, _s.colorSecondary, _s.marginVertical5PX].join(' ')}>© {currentYear} Gab AI, Inc.</span>
        </nav>

        <p className={[_s.default, _s.text, _s.fontSize13PX, _s.colorSecondary, _s.marginTop10PX, _s.marginBottom15PX].join(' ')}>
          <FormattedMessage
            id='getting_started.open_source_notice'
            defaultMessage='Gab Social is open source software. You can contribute or report issues on our self-hosted GitLab at {gitlab}.'
            values={{ gitlab: <a href={source_url} className={[_s.inherit].join(' ')} rel='noopener' target='_blank'>{repository}</a> }}
          />
        </p>
      </div>
    )
  }

}