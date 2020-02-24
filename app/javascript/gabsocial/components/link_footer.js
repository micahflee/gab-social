import moment from 'moment'
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
import Text from './text'
import Button from './button'

const messages = defineMessages({
  help: { id: 'getting_started.help', defaultMessage: 'Help' },
  invite: { id: 'getting_started.invite', defaultMessage: 'Invite people' },
  hotkeys: { id: 'navigation_bar.keyboard_shortcuts', defaultMessage: 'Hotkeys' },
  security: { id: 'getting_started.security', defaultMessage: 'Security' },
  about: { id: 'navigation_bar.info', defaultMessage: 'About' },
  developers: { id: 'getting_started.developers', defaultMessage: 'Developers' },
  terms: { id: 'getting_started.terms', defaultMessage: 'Terms of Service' },
  dmca: { id: 'getting_started.dmca', defaultMessage: 'DMCA' },
  salesTerms: { id: 'getting_started.terms_of_sale', defaultMessage: 'Terms of Sale' },
  privacy: { id: 'getting_started.privacy', defaultMessage: 'Privacy Policy' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'))
  },
})

export default
@connect(null, mapDispatchToProps)
@injectIntl
class LinkFooter extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenHotkeys: PropTypes.func.isRequired,
  }

  render() {
    const { onOpenHotkeys, intl } = this.props

    const currentYear = moment().format('YYYY')

    const linkFooterItems = [
      {
        to: '/help',
        text: intl.formatMessage(messages.help),
        requiresUser: true,
      },
      {
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
        text: intl.formatMessage(messages.salesTerms),
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
      <div className={[_s.default, _s.paddingHorizontal10PX, _s.marginBottom15PX].join(' ')}>
        <nav aria-label='Footer' role='navigation' className={[_s.default, _s.flexWrap, _s.flexRow].join(' ')}>
          {
            linkFooterItems.map((linkFooterItem, i) => {
              if (linkFooterItem.requiresUser && !me) return null

              return (
                <Button
                  text
                  underlineOnHover
                  color='none'
                  backgroundColor='none'
                  key={`link-footer-item-${i}`}
                  href={linkFooterItem.to}
                  data-method={linkFooterItem.logout ? 'delete' : null}
                  onClick={linkFooterItem.onClick || null}
                  className={[_s.marginVertical5PX, _s.paddingRight15PX].join(' ')}
                >
                  <Text size='small' color='secondary'>
                    {linkFooterItem.text}
                  </Text>
                </Button>
              )
            })
          }
        </nav>

        <Text size='small' color='secondary' className={_s.marginTop10PX}>
          © {currentYear} Gab AI, Inc.
        </Text>

        <Text size='small' color='secondary' tagName='p' className={_s.marginTop10PX}>
          <FormattedMessage
            id='getting_started.open_source_notice'
            defaultMessage='Gab Social is open source software. You can contribute or report issues on our self-hosted GitLab at {gitlab}.'
            values={{
              gitlab: (
                <a href={source_url} className={_s.inherit} rel='noopener' target='_blank'>
                  {repository}
                </a>
              )
            }}
          />
        </Text>
      </div>
    )
  }

}