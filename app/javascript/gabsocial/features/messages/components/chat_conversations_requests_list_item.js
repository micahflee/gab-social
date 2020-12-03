import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { shortNumberFormat } from '../../../utils/numbers'
import { fetchChatConversationRequestedCount } from '../../../actions/chat_conversations'
import Text from '../../../components/text'
import Icon from '../../../components/icon'

class ChatConversationRequestsListItem extends React.PureComponent {

  componentDidMount() {
    this.props.onFetchChatConversationRequestedCount()
  }

  render() {
    const { requestCount } = this.props

    if (!requestCount || requestCount < 1) return null

    return (
      <NavLink
        className={[_s.d, _s.w100PC, _s.bgTransparent, _s.bgSubtle_onHover, _s.borderBottom1PX, _s.borderColorSecondary, _s.noUnderline, _s.outlineNone, _s.cursorPointer].join(' ')}
        to='/messages/requests'
      >
        <div className={[_s.d, _s.px15, _s.py15, _s.aiCenter, _s.flexRow].join(' ')}>
          <Text size='medium'>Message Requests</Text>
          <Text size='medium' className={[_s.mlAuto, _s.mr15].join(' ')}>
            {shortNumberFormat(requestCount)}
          </Text>
          <Icon id='angle-right' size='10px' className={_s.cPrimary} />
        </div>
      </NavLink>
    )
  }

}


const mapStateToProps = (state) => ({
  requestCount: state.getIn(['chats', 'chatConversationRequestCount'], 0),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchChatConversationRequestedCount: () => dispatch(fetchChatConversationRequestedCount()),
})

ChatConversationRequestsListItem.propTypes = {
  requestCount: PropTypes.number,
  onFetchChatConversationRequestedCount: PropTypes.func.isRequired,
}

ChatConversationRequestsListItem.defaultProps = {
  requestCount: 0,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatConversationRequestsListItem)