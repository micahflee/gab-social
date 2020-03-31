import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { fetchSuggestions, dismissSuggestion } from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List as ImmutableList } from 'immutable'
import PanelLayout from './panel_layout'
import Divider from '../divider'
import Icon from '../icon'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'about', defaultMessage: 'About' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
  memberSince: { id: 'account.member_since', defaultMessage: 'Member since {date}' },
})

const mapStateToProps = (state, { account }) => {
  const identityProofs = !!account ? state.getIn(['identity_proofs', account.get('id')], ImmutableList()) : ImmutableList()
  return {
    identityProofs,
    domain: state.getIn(['meta', 'domain']),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSuggestions: () => dispatch(fetchSuggestions()),
    dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ProfileInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    identityProofs: ImmutablePropTypes.list,
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.fetchSuggestions()
  }

  render() {
    const { intl, account, identityProofs } = this.props

    if (!account) return null

    const fields = account.get('fields')
    const content = { __html: account.get('note_emojified') }
    const memberSinceDate = intl.formatDate(account.get('created_at'), { month: 'long', year: 'numeric' })
    const hasNote = !!content ? (account.get('note').length > 0 && account.get('note') !== '<p></p>') : false

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <div className={[_s.default].join(' ')}>
          {
            hasNote &&
            <Fragment>
              <div className={_s.dangerousContent} dangerouslySetInnerHTML={content} />
              <Divider small />
            </Fragment>
          }

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
            <Icon id='calendar' width='12px' height='12px' className={_s.fillColorSecondary} />
            <Text
              size='small'
              color='secondary'
              className={_s.ml5}
            >
              {
                intl.formatMessage(messages.memberSince, {
                  date: memberSinceDate
                })
              }
            </Text>
          </div>

          {(fields.size > 0 || identityProofs.size > 0) && (
            <div className={[_s.default]}>
              {identityProofs.map((proof, i) => (
                <Fragment>
                  <Divider small />
                  <dl className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')} key={`profile-identity-proof-${i}`}>
                    <dt
                      className={_s.dangerousContent}
                      dangerouslySetInnerHTML={{ __html: proof.get('provider') }}
                    />

                    { /* : todo : */}
                    <dd className='verified'>
                      <a href={proof.get('proof_url')} target='_blank' rel='noopener noreferrer'>
                        <span title={intl.formatMessage(messages.linkVerifiedOn, { date: intl.formatDate(proof.get('updated_at'), dateFormatOptions) })}>
                          <Icon id='check' className='verified__mark' />
                        </span>
                      </a>
                      <a href={proof.get('profile_url')} target='_blank' rel='noopener noreferrer'>
                        <span
                          className={_s.dangerousContent}
                          dangerouslySetInnerHTML={{ __html: ' ' + proof.get('provider_username') }}
                        />
                      </a>
                    </dd>
                  </dl>
                </Fragment>
              ))}

              {
                fields.map((pair, i) => (
                  <Fragment>
                    <Divider small />
                    <dl className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')} key={`profile-field-${i}`}>
                      <dt
                        className={[_s.text, _s.dangerousContent].join(' ')}
                        dangerouslySetInnerHTML={{ __html: pair.get('name_emojified') }}
                        title={pair.get('name')}
                      />
                      <dd
                        className={[_s.dangerousContent, _s.marginLeftAuto].join(' ')}
                        title={pair.get('value_plain')}
                        dangerouslySetInnerHTML={{ __html: pair.get('value_emojified') }}
                      />
                    </dl>
                  </Fragment>
                ))
              }

            </div>
          )}

        </div>
      </PanelLayout>
    )
  }
}