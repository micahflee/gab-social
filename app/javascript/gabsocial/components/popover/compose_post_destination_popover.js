import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePopover } from '../../actions/popover'
import PopoverLayout from './popover_layout'
import List from '../list'
import Button from '../button'
import Text from '../text'

class ComposePostDesinationPopover extends React.PureComponent {

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      isXS,
    } = this.props

    // TIMELINE
    // GROUP - MY GROUPS
    
    const items = [
      {
        hideArrow: true,
        title: 'Timeline',
        onClick: () => this.handleOnDelete(),
      },
      {
        title: 'Group',
        onClick: () => this.handleOnReport(),
      },
    ]

    return (
      <PopoverLayout
        width={180}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <div className={[_s.d]}>
          <Text className={[_s.d, _s.px15, _s.py10, _s.bgSecondary].join(' ')}>Post to:</Text>
          <List items={items} />
        </div>
        <div>
          <Text className={[_s.d, _s.px15, _s.py10, _s.bgSecondary].join(' ')}>
            <Button
              isText
              icon='back'
            />
            Select group:
          </Text>
          <List items={items} />
        </div>
      </PopoverLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  // 
})

const mapDispatchToProps = (dispatch) => ({
  onClosePopover: () => dispatch(closePopover()),
})

ComposePostDesinationPopover.propTypes = {
  isXS: PropTypes.bool,
  onClosePopover: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposePostDesinationPopover)