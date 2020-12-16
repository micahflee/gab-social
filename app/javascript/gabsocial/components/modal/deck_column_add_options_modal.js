import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openModal } from '../../actions/modal'
import { MODAL_DECK_COLUMN_ADD } from '../../constants'
import Heading from '../heading'
import Button from '../button'
import Block from '../block'

class DeckColumnAddOptionsModal extends React.PureComponent {

  state = {
    selectedItem: null,
  }

  onClickClose = () => {
    this.props.onClose()
    this.props.dispatch(openModal(MODAL_DECK_COLUMN_ADD))
  }

  handleAdd = () => {
    //
  }

  render() {
    const { column } = this.props
    const { selectedItem } = this.state

    // user, hashtag, list, groups

    if (!column) return <div />
    const title = `Select a ${column}`

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
              <Button
                isDisabled={!selectedItem}
                onClick={this.handleAdd}
              >
                Add
              </Button>
            </div>
          </div>
          <div className={[_s.d].join(' ')}>
            test
          </div>
        </Block>
      </div>
    )
  }

}

DeckColumnAddOptionsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  column: PropTypes.string.isRequired,
}

export default connect()(DeckColumnAddOptionsModal)