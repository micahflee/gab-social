import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  CX,
  MODAL_COMPOSE,
  POPOVER_COMPOSE_POST_DESTINATION,
} from '../../../constants'
import { openModal } from '../../../actions/modal'
import { openPopover } from '../../../actions/popover'
import Avatar from '../../../components/avatar'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Text from '../../../components/text'

class ComposeDestinationHeader extends ImmutablePureComponent {

  handleOnClick = () => {
    this.props.onOpenPopover(this.desinationBtn)
  }

  handleOnExpand = () => {
    this.props.onOpenModal()
  }

  setDestinationBtn = (c) => {
    this.desinationBtn = c
  }

  render() {
    const { account, isModal, formLocation } = this.props

    const isIntroduction = formLocation === 'introduction'
    const title = 'Post to timeline'

    return (
      <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.bgPrimary, _s.w100PC, _s.h40PX, _s.pr15].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.pl15, _s.flexGrow1, _s.mrAuto, _s.h40PX].join(' ')}>
          <Avatar account={account} size={28} />
          {
            !isIntroduction &&
            <div className={[_s.ml15].join(' ')}>
              <Button
                isNarrow
                isOutline
                radiusSmall
                buttonRef={this.setDestinationBtn}
                backgroundColor='secondary'
                color='primary'
                onClick={this.handleOnClick}
                className={[_s.border1PX, _s.borderColorPrimary].join(' ')}
              >
                <Text color='inherit' size='small' className={_s.jcCenter}>
                  {title}
                  <Icon id='caret-down' size='8px' className={_s.ml5} />
                </Text>
              </Button>
            </div>
          }
        </div>
        {
          !isModal && !isIntroduction &&
          <Button
            isText
            isNarrow
            backgroundColor='none'
            color='tertiary'
            icon='fullscreen'
            onClick={this.handleOnExpand}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  onOpenModal() {
    dispatch(openModal(MODAL_COMPOSE))
  },
  onOpenPopover(targetRef) {
    dispatch(openPopover(POPOVER_COMPOSE_POST_DESTINATION, {
      targetRef,
      position: 'bottom',
    }))
  },
})

ComposeDestinationHeader.propTypes = {
  account: ImmutablePropTypes.map,
  isModal: PropTypes.bool,
  onOpenModal: PropTypes.func.isRequired,
  onOpenPopover: PropTypes.func.isRequired,
  formLocation: PropTypes.string,
}

export default connect(null, mapDispatchToProps)(ComposeDestinationHeader)