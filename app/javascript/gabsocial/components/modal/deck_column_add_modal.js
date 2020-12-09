import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDeckColumnAtIndex } from '../../actions/deck'
import { openModal } from '../../actions/modal'
import ModalLayout from './modal_layout'
import Button from '../button'
import Text from '../text'

class DeckColumnAddModal extends React.PureComponent {

  onAdd = (column) => {
    console.log("onAdd column: ", column)
    switch (column) {
      case 'user':
        // 
        break
      case 'list':
        // 
        break
      case 'group':
        // 
        break
      default:
        this.props.dispatch(setDeckColumnAtIndex(column))
        this.props.onClose()
        break
    }
  }

  render() {
    const {
      intl,
      onClose,
    } = this.props

    return (
      <ModalLayout
        title='Choose a column type to add'
        onClose={onClose}
        width={520}
      >
        <div className={_s.d}>
          <div className={[_s.d, _s.pl10, _s.borderBottom1PX, _s.borderColorSecondary, _s.flexRow, _s.aiCenter, _s.jcCenter].join(' ')}>
            <DeckColumnAddModalButton icon='home' type='Home' onClick={() => this.onAdd('home')} />
            <DeckColumnAddModalButton icon='group' type='User' onClick={() => this.onAdd('user')} />
            <DeckColumnAddModalButton icon='notifications' type='Notifications' onClick={() => this.onAdd('notifications')} />
          </div>
          <div className={[_s.d, _s.pl10, _s.borderBottom1PX, _s.borderColorSecondary, _s.flexRow, _s.aiCenter, _s.jcCenter].join(' ')}>
            <DeckColumnAddModalButton icon='list' type='List' onClick={() => this.onAdd('list')} />
            <DeckColumnAddModalButton icon='like' type='Likes' onClick={() => this.onAdd('likes')} />
            <DeckColumnAddModalButton icon='bookmark' type='Bookmarks' onClick={() => this.onAdd('bookmarks')} />
          </div>
          <div className={[_s.d, _s.pl10, _s.pb10, _s.flexRow, _s.aiCenter, _s.jcCenter].join(' ')}>
            <DeckColumnAddModalButton icon='pro' type='PRO Timeline' onClick={() => this.onAdd('pro')} />
            <DeckColumnAddModalButton icon='pencil' type='Compose' onClick={() => this.onAdd('compose')} />
            <DeckColumnAddModalButton icon='group' type='Group Timeline' onClick={() => this.onAdd('group')} />
          </div>
        </div>
      </ModalLayout>
    )
  }

}

const DeckColumnAddModalButton = ({ icon, type, onClick }) => (
  <Button
    radiusSmall
    color='primary'
    backgroundColor='none'
    icon={icon}
    iconSize='28px'
    onClick={onClick}
    iconClassName={[_s.px15, _s.pb5, _s.py10].join(' ')}
    className={[_s.flexColumn, _s.bgSubtle_onHover, _s.my10, _s.mr10, _s.aiCenter, _s.flexNormal].join(' ')}
  >
    <Text color='inherit' size='medium' weight='medium' className={_s.pb5}>
      {type}
    </Text>
  </Button>
)


DeckColumnAddModalButton.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default connect()(DeckColumnAddModal)