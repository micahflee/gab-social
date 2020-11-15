import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NavLink } from 'react-router-dom'
import { CX } from '../../../constants'
import Input from '../../../components/input'
import DisplayName from '../../../components/display_name'
import Avatar from '../../../components/avatar'
import Text from '../../../components/text'
import RelativeTimestamp from '../../../components/relative_timestamp'
import { makeGetAccount } from '../../../selectors'

class MessagesListItem extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    composeFocused: false,
  }

  render() {
    const {
      account,
      intl,
      selected,
    } = this.props

    const buttonClasses = CX({
      d: 1,
      pt2: 1,
      pr5: 1,
      noUnderline: 1,
      overflowHidden: 1,
      flexNormal: 1,
      flexRow: 1,
      aiStart: 1,
      aiCenter: 1,
    })

    const containerClasses = CX({
      d: 1,
      bgSubtle_onHover: 1,
      borderBottom1PX: 1,
      borderColorSecondary: 1,
      noUnderline: 1,
    })

    const innerContainerClasses = CX({
      d: 1,
      flexRow: 1,
      aiStart: 1,
      aiCenter: 0,
      px15: 1,
      py15: 1,
      borderRight4PX: selected,
      borderColorBrand: selected,
    })

    const avatarSize = 49
    const content = { __html: 'REEEE i heard you have the sauce?' }

    return (
        <NavLink
          className={containerClasses}
          title={account.get('acct')}
          to={`/messages/conversation-id`}
        >
          <div className={innerContainerClasses}>

            <Avatar account={account} size={avatarSize} noHover />

            <div className={[_s.d, _s.pl10, _s.overflowHidden, _s.flexNormal].join(' ')}>
              <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
                <div className={buttonClasses}>
                  <div className={_s.maxW100PC42PX}>
                    <DisplayName account={account} noHover />
                  </div>
                  <Text size='extraSmall' color='secondary' className={_s.mlAuto}>
                    May 1
                    { /* <RelativeTimestamp timestamp={'2020-20-10'} /> */ }
                  </Text>
                </div>
              </div>

              <div className={[_s.py5, _s.dangerousContent].join(' ')} dangerouslySetInnerHTML={content} />
            </div>
          </div>
        </NavLink>
    )
  }

}

const mapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, '1'),
})

MessagesListItem.propTypes = {
  intl: PropTypes.object.isRequired,
  selected: PropTypes.bool,
}

export default connect(mapStateToProps)(MessagesListItem)