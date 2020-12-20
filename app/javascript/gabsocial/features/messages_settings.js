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
import BlockHeading from '../components/block_heading'
import Button from '../components/button'
import Form from '../components/form'
import Switch from '../components/switch'
import Text from '../components/text'
import Divider from '../components/divider'

class MessagesSettings extends ImmutablePureComponent {

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
      <div className={[_s.d, _s.w100PC, _s.boxShadowNone].join(' ')}>
        <div className={[_s.d, _s.h60PX, _s.w100PC, _s.px10, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <BlockHeading title={'Chat Preferences'} />
        </div>

        <div className={[_s.d, _s.px15, _s.py15, _s.overflowHidden].join(' ')}>
          <Form>
            <Switch
              label='Restrict messages from people you dont follow'
              checked={true}
              onChange={this.handleLockedChange}
            />
            <div className={[_s.d, _s.w100PC, _s.my10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
            <Switch
              label='Show when you are active'
              checked={false}
              onChange={this.handleLockedChange}
            />
            <div className={[_s.d, _s.w100PC, _s.my10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
            <Switch
              label='Notification sound enabled'
              checked={false}
              onChange={this.handleLockedChange}
            />
          </Form>
        </div>
      </div>
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

MessagesSettings.propTypes = {
  accountIds: ImmutablePropTypes.list,
  hasMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  onExpandMutes: PropTypes.func.isRequired,
  onFetchMutes: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MessagesSettings))