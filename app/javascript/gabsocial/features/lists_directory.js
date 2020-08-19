import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import { getOrderedLists } from '../selectors'
import { fetchLists } from '../actions/lists'
import List from '../components/list'

class ListsDirectory extends ImmutablePureComponent {

  state = {
    fetched: false,
  }

  componentDidMount() {
    this.props.onFetchLists()
      .then(() => this.setState({ fetched: true }))
      .catch(() => this.setState({ fetched: true }))
  }

  render() {
    const { intl, lists } = this.props
    const { fetched } = this.state

    const emptyMessage = intl.formatMessage(messages.empty)

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

const mapStateToProps = (state) => ({
  lists: getOrderedLists(state),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchLists: () => dispatch(fetchLists()),
})

ListsDirectory.propTypes = {
  intl: PropTypes.object.isRequired,
  lists: ImmutablePropTypes.list,
  onFetchLists: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ListsDirectory))