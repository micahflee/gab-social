import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearSelectedGif } from '../../../actions/tenor'
import Image from '../../../components/image'

class GifForm extends React.PureComponent {

  render () {
    const {
      selectedGifSrc,
      small,
    } = this.props

    if (!selectedGifSrc) return null

    return (
      <div className={_s.d}>
        <div className={[_s.d, _s.flexRow, _s.flexWrap].join(' ')}>
          <Image
            width='auto'
            src={selectedGifSrc}
            className={[_s.maxW100PC, _s.radiusSmall, _s.h260PX].join(' ')}
          />
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onClearSelectedGif() {
    dispatch(clearSelectedGif())
  },
})

GifForm.propTypes = {
  onClearSelectedGif: PropTypes.func.isRequired,
  replyToId: PropTypes.string,
  small: PropTypes.bool,
  selectedGifSrc: PropTypes.string.isRequired,
}

export default connect(null, mapDispatchToProps)(GifForm)