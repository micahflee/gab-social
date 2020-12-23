import React from 'react'
import PropTypes from 'prop-types'
import Block from '../block'
import Status from '../../features/status'

class StatusModal extends React.PureComponent {

  render() {
    const { statusId } = this.props

    return (
      <div style={{width: '580px'}} className={[_s.d, _s.modal].join(' ')}>
        <Block>
          <div className={[_s.d, _s.w100PC, _s.maxH80VH, _s.overflowYScroll].join(' ')}>
            <Status id={statusId} />
          </div>
        </Block>
      </div>
    )
  }

}

StatusModal.propTypes = {
  statusId: PropTypes.string,
}

export default StatusModal