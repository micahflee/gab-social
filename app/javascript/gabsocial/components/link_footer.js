import React from 'react'
import PropTypes from 'prop-types'
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
} from 'react-intl'
import {
  me,
  repository,
  source_url,
} from '../initial_state'
import { DEFAULT_REL } from '../constants'
import Text from './text'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'

class LinkFooter extends React.PureComponent {

  render() {
    const { intl } = this.props

    const currentYear = new Date().getFullYear()

    const linkFooterItems = [
      {
        href: 'https://help.gab.com',
        text: intl.formatMessage(messages.help),
      },
      {
        href: '/auth/edit',
        text: intl.formatMessage(messages.security),
        requiresUser: true,
      },
      {
        to: '/about',
        text: intl.formatMessage(messages.about),
      },
      {
        to: '/about/investors',
        text: intl.formatMessage(messages.investors),
      },
      {
        to: '/about/sales',
        text: intl.formatMessage(messages.salesTerms),
      },
      {
        to: '/about/dmca',
        text: intl.formatMessage(messages.dmca),
      },
      {
        to: '/about/tos',
        text: intl.formatMessage(messages.terms),
      },
      {
        to: '/about/privacy',
        text: intl.formatMessage(messages.privacy),
      },
      {
        href: 'https://gabstatus.com/',
        text: 'Status',
      },
      {
        href: '/auth/sign_out',
        text: intl.formatMessage(messages.logout),
        requiresUser: true,
        logout: true,
      },
    ]

    return (
      <div className={[_s.d, _s.mb15].join(' ')}>
        <nav aria-label='Footer' role='navigation' className={[_s.d, _s.flexWrap, _s.flexRow].join(' ')}>
          {
            linkFooterItems.map((linkFooterItem, i) => {
              if (linkFooterItem.requiresUser && !me) return null

              return (
                <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter].join(' ')}>
                  <Button
                    isText
                    underlineOnHover
                    color='none'
                    backgroundColor='none'
                    key={`link-footer-item-${i}`}
                    to={linkFooterItem.to}
                    href={linkFooterItem.href}
                    data-method={linkFooterItem.logout ? 'delete' : null}
                    onClick={linkFooterItem.onClick || null}
                    className={[_s.mt5].join(' ')}
                  >
                    <Text size='small' color='tertiary'>
                      {linkFooterItem.text}
                    </Text>
                  </Button>
                  { !linkFooterItem.logout && <Text size='small' color='secondary' className={[_s.pt2, _s.mr5, _s.ml5].join(' ')}>·</Text> }
                </div>
              )
            })
          }
        </nav>

        <Text size='small' color='tertiary' className={_s.mt10}>
          © {currentYear} Gab AI, Inc.
        </Text>

        <Text size='small' color='tertiary' tagName='p' className={_s.mt10}>
          <FormattedMessage
            id='getting_started.open_source_notice'
            defaultMessage='Gab Social is open source software. You can contribute or report issues on our self-hosted GitLab at {gitlab}.'
            values={{
              gitlab: (
                <a href={source_url} className={[_s.displayInlineBlock, _s.inherit].join(' ')} rel={DEFAULT_REL} target='_blank'>
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

const messages = defineMessages({
  investors: { id: 'getting_started.investors', defaultMessage: 'Investors' },
  help: { id: 'getting_started.help', defaultMessage: 'Help' },
  security: { id: 'getting_started.security', defaultMessage: 'Security' },
  about: { id: 'navigation_bar.info', defaultMessage: 'About' },
  developers: { id: 'getting_started.developers', defaultMessage: 'Developers' },
  terms: { id: 'getting_started.terms', defaultMessage: 'Terms of Service' },
  dmca: { id: 'getting_started.dmca', defaultMessage: 'DMCA' },
  salesTerms: { id: 'getting_started.terms_of_sale', defaultMessage: 'Terms of Sale' },
  privacy: { id: 'getting_started.privacy', defaultMessage: 'Privacy Policy' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
})

LinkFooter.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default injectIntl(LinkFooter)