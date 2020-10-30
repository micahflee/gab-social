import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import { getOrderedLists } from '../selectors'
import { fetchLists } from '../actions/lists'
import { openModal } from '../actions/modal'
import { MODAL_LIST_CREATE } from '../constants'
import List from '../components/list'
import Text from '../components/text'
import Button from '../components/button'

class ListsDirectory extends ImmutablePureComponent {

  state = {
    fetched: false,
  }

  componentDidMount() {
    this.props.onFetchLists()
      .then(() => this.setState({ fetched: true }))
      .catch(() => this.setState({ fetched: true }))
  }

  handleOnOpenListCreateModal = () => {
    this.props.onOpenListCreateModal()
  }

  render() {
    const { intl, lists } = this.props 
    const { fetched } = this.state

    const emptyMessage = (
      <div className={[_s.d, _s.w100PC, _s.aiCenter, _s.jcCenter].join(' ')}>
        <Text>{intl.formatMessage(messages.empty)}</Text>
        <Button
          className={[_s.d, _s.mt15].join(' ')}
          onClick={this.handleOnOpenListCreateModal}
        >
          Create a List
        </Button>
      </div>
    )

    const listItems = lists.map(list => ({
      to: `/lists/${list.get('id')}`,
      title: list.get('title'),
    }))

    return (
      <List
        scrollKey='lists'
        showLoading={lists.size === 0 && !fetched}
        emptyMessage={emptyMessage}
        items={listItems}
      />
    )
  }

}

const messages = defineMessages({
  add: { id: 'lists.new.create', defaultMessage: 'Add List' },
  empty: { id: 'empty_column.lists', defaultMessage: 'You don\'t have any lists yet. When you create one, it will show up here.' },
})

const mapDispatchToProps = (dispatch) => ({
  onFetchLists: () => dispatch(fetchLists()),
  onOpenListCreateModal: () => dispatch(openModal(MODAL_LIST_CREATE)),
})

const mapStateToProps = (state) => ({
  lists: getOrderedLists(state),
})

ListsDirectory.propTypes = {
  intl: PropTypes.object.isRequired,
  lists: ImmutablePropTypes.list,
  onFetchLists: PropTypes.func.isRequired,
  onOpenListCreateModal: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ListsDirectory))