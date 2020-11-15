import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NavLink } from 'react-router-dom'
import { CX } from '../../../constants'
import Input from '../../../components/input'
import Avatar from '../../../components/avatar'
import Button from '../../../components/button'
import Text from '../../../components/text'
import RelativeTimestamp from '../../../components/relative_timestamp'
import { makeGetAccount } from '../../../selectors'

class MessagesItem extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ isHovering: true }) 
  }
  
  handleOnMouseLeave = () => {
    this.setState({ isHovering: false })
  }

  render() {
    const {
      account,
      intl,
      alt,
    } = this.props
    const { isHovering } = this.state

    const content = { __html: 'REEEE i heard you have the sauce2?' }
    const messageContainerClasses = CX({
      d: 1,
      flexRow: !alt,
      flexRowReverse: alt,
    })
    const messageInnerContainerClasses = CX({
      d: 1,
      px15: 1,
      py5: 1,
      bgSecondary: !alt,
      bgBrandLight: alt,
      circle: 1,
      ml10: 1,
      mr10: 1,
    })

    const lowerContainerClasses = CX({
      d: 1,
      pt10: 1,
      pl50: !alt,
      pr50: alt,
    })

    const buttonContainerClasses = CX({
      d: 1,
      flexRow: 1,
      displayNone: !isHovering,
    })

    return (
      <div
        className={[_s.d, _s.w100PC, _s.pb10].join(' ')}
        onMouseEnter={this.handleOnMouseEnter}
        onMouseLeave={this.handleOnMouseLeave}
      >
        <div className={[_s.d, _s.w100PC, _s.pb15].join(' ')}>

          <div className={messageContainerClasses}>
            <Avatar account={account} size={38} />
            <div className={messageInnerContainerClasses}>
              <div className={[_s.py5, _s.dangerousContent].join(' ')} dangerouslySetInnerHTML={content} />
            </div>
            <div className={buttonContainerClasses}>
              <Button
                onClick={undefined}
                color='tertiary'
                backgroundColor='none'
                icon='ellipsis'
                iconSize='18px'
              />
            </div>
          </div>
          <div className={lowerContainerClasses}>
            <Text size='small' color='tertiary' align={alt ? 'right' : 'left'}>
              Apr 16, 2020, 8:20 AM
              { /* <RelativeTimestamp timestamp={'2020-20-10'} /> */ }
            </Text>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, '1'),
})

MessagesItem.propTypes = {
  intl: PropTypes.object.isRequired,
  alt: PropTypes.bool,
}

export default connect(mapStateToProps)(MessagesItem)