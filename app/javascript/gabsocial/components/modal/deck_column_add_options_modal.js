import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { openModal } from '../../actions/modal'
import { setDeckColumnAtIndex } from '../../actions/deck'
import { getOrderedLists, getListOfGroups } from '../../selectors'
import { fetchLists } from '../../actions/lists'
import {
  fetchDeckAccountSuggestions,
  clearDeckAccountSuggestions,
} from '../../actions/deck'
import { fetchGroupsByTab } from '../../actions/groups'
import { MODAL_DECK_COLUMN_ADD } from '../../constants'
import Account from '../account'
import Heading from '../heading'
import Button from '../button'
import Block from '../block'
import Input from '../input'
import List from '../list'
import Text from '../text'

class DeckColumnAddOptionsModal extends ImmutablePureComponent {

  state = {
    hashtagValue: '',
    usernameValue: '',
  }

  componentDidMount() {
    switch (this.props.column) {
      case 'list':
        this.props.onFetchLists()
        break
      case 'group':
        this.props.onFetchMemberGroups()
        break
      default:
        break
    }
  }

  onClickClose = () => {
    this.props.onClose()
    this.props.onOpenDeckColumnAddModal()
  }

  handleAdd = (id) => {
    this.props.onSetDeckColumn(id)
    this.props.onClose()
  }

  handleAddHashtag = () => {
    this.handleAdd(`hashtag.${this.state.hashtagValue}`)
    this.setState({ hashtagValue: '' })
  }

  handleAddUser = (userId) => {
    this.setState({ usernameValue: '' })
    this.props.onClearDeckAccountSuggestions()
    if (!!userId) this.handleAdd(`user.${userId}`)
  }

  onChangeHashtagValue = (hashtagValue) => {
    this.setState({ hashtagValue })
  }

  onChangeUsernameValue = (usernameValue) => {
    this.setState({ usernameValue })
    this.props.onFetchUserSuggestions(usernameValue)
  }

  getContentForColumn = () => {
    const { column, lists, groups, suggestionsIds } = this.props
    const { hashtagValue, usernameValue } = this.state

    if (column === 'hashtag') {
      return (
        <div className={[_s.d, _s.px15, _s.py10].join(' ')}>
          <Input
            type='text'
            value={hashtagValue}
            placeholder='gabfam'
            id='hashtag-deck'
            title='Enter hashtag'
            onChange={this.onChangeHashtagValue}
          />
        </div>
      )
    } else if (column === 'list') {
      const listItems = lists.map((list) => ({
        onClick: () => this.handleAdd(`list.${list.get('id')}`),
        title: list.get('title'),
      }))
  
      return (
        <div className={[_s.d, _s.maxH340PX, _s.overflowYScroll].join(' ')}>
          <List
            scrollKey='lists-deck-add'
            showLoading={lists.size === 0}
            emptyMessage="You don't have any lists yet."
            items={listItems}
          />
        </div>
      )
    } else if (column === 'group') {
      const listItems = groups.map((group) => ({
        onClick: () => this.handleAdd(`group.${group.get('id')}`),
        title: group.get('title'),
      }))
  
      return (
        <div className={[_s.d, _s.maxH340PX, _s.overflowYScroll].join(' ')}>
          <List
            scrollKey='groups-deck-add'
            showLoading={groups.size === 0}
            emptyMessage="You are not a member of any groups yet."
            items={listItems}
          />
        </div>
      )
    } else if (column === 'user') {
      return (
        <div className={[_s.d, _s.width100PC].join(' ')}>
          <div className={[_s.d, _s.px15, _s.py10].join(' ')}>
            <Input
              type='text'
              value={usernameValue}
              placeholder=''
              id='user-deck'
              title='Enter username'
              onChange={this.onChangeUsernameValue}
            />
          </div>

          <div className={[_s.d, _s.pt10].join(' ')}>
            <div className={[_s.d].join(' ')}>
              <Text weight='bold' size='small' color='secondary' className={[_s.d, _s.px15, _s.ml15, _s.mt5, _s.mb15].join(' ')}>
                Search results ({suggestionsIds.size})
              </Text>
              {
                suggestionsIds &&
                suggestionsIds.map((accountId) => (
                  <Account
                    compact
                    key={`create-deck-user-${accountId}`}
                    id={accountId}
                    onActionClick={() => this.handleAddUser(accountId)}
                    actionIcon='add'
                  />
                ))
              }
            </div>
          </div>
        </div>
      )
    }

  }

  render() {
    const { column } = this.props
    const { hashtagValue } = this.state

    if (!column) return <div />
    const title = `Select a ${column}`

    const content = this.getContentForColumn()

    return (
      <div style={{width: '520px'}} className={[_s.d, _s.modal].join(' ')}>
        <Block>
          <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.jcCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.h53PX, _s.pl10, _s.pr15].join(' ')}>
            <div className={[_s.d, _s.w115PX, _s.aiStart, _s.jcCenter, _s.mrAuto].join(' ')}>
              <Button
                backgroundColor='none'
                title='Back'
                onClick={this.onClickClose}
                color='secondary'
                icon='back'
                iconSize='16px'
              />
            </div>
            <Heading size='h2'>
              {title}
            </Heading>
            <div className={[_s.d, _s.w115PX, _s.aiEnd, _s.jcCenter, _s.mlAuto].join(' ')}>
              {
                column === 'hashtag' &&
                <Button
                  isDisabled={!hashtagValue}
                  onClick={this.handleAddHashtag}
                >
                  Add
                </Button>
              }
            </div>
          </div>
          <div className={[_s.d].join(' ')}>
            {content}
          </div>
        </Block>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  lists: getOrderedLists(state),
  groups: getListOfGroups(state, { type: 'member' }),
  suggestionsIds: state.getIn(['deck', 'accountSuggestions']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchLists() {
    dispatch(fetchLists())
  },
  onFetchMemberGroups() {
    dispatch(fetchGroupsByTab('member'))
  },
  onSetDeckColumn(id) {
    dispatch(setDeckColumnAtIndex(id))
  },
  onOpenDeckColumnAddModal() {
    dispatch(openModal(MODAL_DECK_COLUMN_ADD))
  },
  onFetchUserSuggestions(query) {
    dispatch(fetchDeckAccountSuggestions(query))
  },
  onClearDeckAccountSuggestions() {
    dispatch(clearDeckAccountSuggestions())
  }
})

DeckColumnAddOptionsModal.propTypes = {
  groupIds: ImmutablePropTypes.list,
  onClose: PropTypes.func.isRequired,
  onFetchLists: PropTypes.func.isRequired,
  onSetDeckColumn: PropTypes.func.isRequired,
  column: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckColumnAddOptionsModal)