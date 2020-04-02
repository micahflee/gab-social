import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Icon from './icon'
import Text from './text'

const messages = defineMessages({
  filtered: { id: 'status.filtered', defaultMessage: 'Filtered' },
  promoted: { id: 'status.promoted', defaultMessage: 'Promoted gab' },
  pinned: { id: 'status.pinned', defaultMessage: 'Pinned gab' },
  reposted: { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
})

export default
@injectIntl
class StatusPrepend extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map,
    featured: PropTypes.bool,
    promoted: PropTypes.bool,
  }

  render() {
    const {
      intl,
      status,
      featured,
      promoted,
    } = this.props

    if (!status) return null

    const isRepost = (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object')

    if (!featured && !promoted && !isRepost) return null

    const iconId = featured ? 'pin' : promoted ? 'star' : 'repost'

    return (
      <div className={[_s.default, _s.width100PC, _s.alignItemsStart, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <div className={[_s.default, _s.width100PC, _s.flexRow, _s.alignItemsCenter, _s.py5, _s.px15].join(' ')}>
          <Icon id={iconId} width='12px' height='12px' className={[_s.fillColorSecondary, _s.mr5].join(' ')} />
          {
            isRepost &&
            <div className={[_s.default, _s.flexRow].join(' ')}>
              <Text size='small' color='secondary'>
                <FormattedMessage
                  id='status.reposted_by'
                  defaultMessage='{name} reposted'
                  values={{
                    name: (
                      <NavLink
                        className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                        to={`/${status.getIn(['account', 'acct'])}`}
                      >
                        <Text size='small' color='secondary'>
                          <bdi>
                            <span dangerouslySetInnerHTML={{ __html: status.getIn(['account', 'display_name_html']) }} />
                          </bdi>
                        </Text>
                      </NavLink>
                    )
                  }}
                />
              </Text>
            </div>
          }
          {
            !isRepost &&
            <Text color='secondary' size='small'>
              {intl.formatMessage(featured ? messages.pinned : messages.promoted)}
            </Text>
          }
        </div>
      </div>
    )
  }

}
