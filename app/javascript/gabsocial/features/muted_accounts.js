import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import { fetchMutes, expandMutes } from '../actions/mutes'
import Account from '../components/account'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import ScrollableList from '../components/scrollable_list'

class MutedAccounts extends ImmutablePureComponent {

  componentWillMount() {
    this.props.onFetchMutes()
  }

  handleLoadMore = debounce(() => {
    this.props.onExpandMutes()
  }, 300, { leading: true })

  render() {
    const {
      accountIds,
      hasMore,
      isLoading,
    } = this.props

    return (
      <Block>
        <BlockHeading title={<FormattedMessage id='navigation_bar.mutes' defaultMessage='Muted users' />} />
        <ScrollableList
          scrollKey='mutes'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          emptyMessage={<FormattedMessage id='empty_column.mutes' defaultMessage="You haven't muted any users yet." />}
        >
          {
            accountIds && accountIds.map((id) =>
              <Account
                key={`mutes-${id}`}
                id={id}
                compact
              />
            )
          }
        </ScrollableList>
      </Block>
    )
  }

}

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'mutes', me, 'items']),
  hasMore: !!state.getIn(['user_lists', 'mutes', me, 'next']),
  isLoading: state.getIn(['user_lists', 'mutes', me, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchMutes: () => dispatch(fetchMutes()),
  onExpandMutes: () => dispatch(expandMutes()),
})

MutedAccounts.propTypes = {
  accountIds: ImmutablePropTypes.list,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  onExpandMutes: PropTypes.func.isRequired,
  onFetchMutes: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MutedAccounts))