import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'
import { fetchReposts } from '../actions/interactions'
import { fetchStatus } from '../actions/statuses'
import { makeGetStatus } from '../selectors'
import Account from '../components/account'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'

class StatusReposts extends ImmutablePureComponent {

  componentWillMount () {
    this.props.dispatch(fetchReposts(this.props.statusId))
    this.props.dispatch(fetchStatus(this.props.statusId))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.statusId !== this.props.statusId && nextProps.statusId) {
      this.props.dispatch(fetchReposts(nextProps.statusId))
      this.props.dispatch(fetchStatus(nextProps.statusId))
    }
  }

  render () {
    const { accountIds, status } = this.props

    if (!accountIds) {
      return <ColumnIndicator type='loading' />
    } else if (!status) {
      return <ColumnIndicator type='missing' />
    }

    return (
      <ScrollableList
        scrollKey='reposts'
        emptyMessage={<FormattedMessage id='status.reposts.empty' defaultMessage='No one has reposted this gab yet. When someone does, they will show up here.' />}
      >
        {
          accountIds.map(id =>
            <Account key={id} id={id} />
          )
        }
      </ScrollableList>
    )
  }

}

const mapStateToProps = (state, props) => {
  const statusId = props.params ? props.params.statusId : props.statusId

  const getStatus = makeGetStatus()
  const status = getStatus(state, {
    id: statusId,
    // username: props.params.username,
  })

  return {
    status,
    statusId,
    accountIds: state.getIn(['user_lists', 'reblogged_by', statusId]),
  }
}

StatusReposts.propTypes = {
  accountIds: ImmutablePropTypes.list,
  dispatch: PropTypes.func.isRequired,
  status: ImmutablePropTypes.map,
  statusId: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(StatusReposts)