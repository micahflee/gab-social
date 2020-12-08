import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDeckColumnAtIndex } from '../../actions/deck'
import { saveSettings } from '../../actions/settings'
import { openModal } from '../../actions/modal'
import ModalLayout from './modal_layout'
import Button from '../button'
import Text from '../text'

class DeckColumnAddModal extends React.PureComponent {

  onAdd = (column) => {
    switch (column) {
      case 'user':
        // 
        break
      case 'list':
        // 
        break
      case 'groups':
        // 
        break
      case 'group':
        // 
        break
      default:
        this.props.dispatch(setDeckColumnAtIndex(column))
        this.props.dispatch(saveSettings())
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
            <DeckColumnAddModalButton icon='notifications' type='Notifications' onClick={() => this.onAdd('home')} />
          </div>
          <div className={[_s.d, _s.pl10, _s.borderBottom1PX, _s.borderColorSecondary, _s.flexRow, _s.aiCenter, _s.jcCenter].join(' ')}>
            <DeckColumnAddModalButton icon='list' type='List' onClick={() => this.onAdd('list')} />
            <DeckColumnAddModalButton icon='like' type='Likes' onClick={() => this.onAdd('likes')} />
            <DeckColumnAddModalButton icon='bookmark' type='Bookmarks' onClick={() => this.onAdd('bookmarks')} />
          </div>
          <div className={[_s.d, _s.pl10, _s.pb10, _s.flexRow, _s.aiCenter, _s.jcCenter].join(' ')}>
            <DeckColumnAddModalButton icon='pro' type='PRO Timeline' onClick={() => this.onAdd('pro')} />
            <DeckColumnAddModalButton icon='group' type='Groups Timeline' onClick={() => this.onAdd('groups')} />
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
  onSetDeckColumnAtIndex: PropTypes.func.isRequired,
}

export default connect()(DeckColumnAddModal)