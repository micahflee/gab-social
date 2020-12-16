import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { fetchAccount } from '../actions/accounts'
import DeckColumnHeader from './deck_column_header'
import Avatar from './avatar'
import DisplayName from './display_name'
import {
  FONT_SIZES,
  DEFAULT_FONT_SIZE,
  FONT_SIZES_EXTRA_SMALL,
  FONT_SIZES_SMALL,
  FONT_SIZES_NORMAL,
  FONT_SIZES_MEDIUM,
  FONT_SIZES_LARGE,
  FONT_SIZES_EXTRA_LARGE
} from '../constants'

class DeckColumn extends ImmutablePureComponent {

  state = {
    width: 360, // default
    refreshBool: false,
  }

  componentDidMount() {
    this.setWidth()
    
    const { accountId, account } = this.props
    if (!!accountId || !account) {
      this.props.onFetchAccount(accountId)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fontSize !== this.props.fontSize) {
      this.setWidth()
    }
  }

  setWidth = () => {
    const { fontSize } = this.props

    let width = 360
    switch (FONT_SIZES[fontSize]) {
      case FONT_SIZES_EXTRA_SMALL:
        width = 310
        break;
      case FONT_SIZES_SMALL:
        width = 320
        break;
      case FONT_SIZES_NORMAL:
        width = 335
        break;
      case FONT_SIZES_MEDIUM:
        width = 350
        break;
      case FONT_SIZES_LARGE:
        width = 365
        break;
      case FONT_SIZES_EXTRA_LARGE:
        width = 385
        break;
      default:
        break;
    }

    this.setState({ width })
  }

  handleOnRefresh = () => {
    //hacky
    this.setState({ refreshBool: true })
    setTimeout(() => {
      this.setState({ refreshBool: false })
    }, 100);
  }

  render() {
    const {
      title,
      subtitle,
      icon,
      children,
      index,
      noButtons,
      noRefresh,
      account,
    } = this.props
    const { width, refreshBool } = this.state

    let newTitle = title
    if (!!account) {
      
      newTitle = (
        <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
          <Avatar account={account} noHover size={30} />
          <div className={[_s.d, _s.ml10].join(' ')}>
            <DisplayName account={account} noUsername isInline noHover />
          </div>
        </div>
      )
    }

    return (
      <div className={[_s.d, _s.px2, _s.bgSecondary, _s.h100VH].join(' ')} style={{ width: `${width}px` }}>
        <div className={[_s.d, _s.w100PC, _s.bgPrimary, _s.h100VH].join(' ')}>
          <DeckColumnHeader
            title={newTitle}
            subtitle={subtitle}
            icon={icon}
            index={index}
            noButtons={noButtons}
            noRefresh={noRefresh}
            onRefresh={this.handleOnRefresh}
          />
          <div className={[_s.d, _s.w100PC, _s.overflowYScroll, _s.boxShadowNone, _s.posAbs, _s.top60PX, _s.left0, _s.right0, _s.bottom0].join(' ')}>
            { !refreshBool && children}
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, { accountId }) => {
  const account = !!accountId ? state.getIn(['accounts', accountId]) : null

  return {
    account,
    fontSize: state.getIn(['settings', 'displayOptions', 'fontSize'], DEFAULT_FONT_SIZE),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchAccount(accountId) {
    dispatch(fetchAccount(accountId))
  }
})

DeckColumn.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  index: PropTypes.number,
  noButtons: PropTypes.bool,
  noRefresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  accountId: PropTypes.string,
  account: ImmutablePropTypes.map,
  onFetchAccount: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckColumn)