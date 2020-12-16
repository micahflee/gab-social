import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ProgressBar from '../../../components/progress_bar'
import Upload from './media_upload_item'
import SensitiveMediaButton from './sensitive_media_button'

class UploadForm extends ImmutablePureComponent {

  render () {
    const {
      mediaIds,
      isUploading,
      uploadProgress,
    } = this.props

    return (
      <div className={_s.d}>
        { isUploading && <ProgressBar small progress={uploadProgress} /> }

        <div className={[_s.d, _s.flexRow, _s.flexWrap].join(' ')}>
          {mediaIds.map(id => (
            <Upload id={id} key={id} />
          ))}
        </div>

        { !mediaIds.isEmpty() && <SensitiveMediaButton /> }
        { isUploading && <ProgressBar small progress={uploadProgress} /> }
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  mediaIds: state.getIn(['compose', 'media_attachments']).map(item => item.get('id')),
  isUploading: state.getIn(['compose', 'is_uploading']),
  uploadProgress: state.getIn(['compose', 'progress'], 0),
})

UploadForm.propTypes = {
  isUploading: PropTypes.bool,
  mediaIds: ImmutablePropTypes.list.isRequired,
  uploadProgress: PropTypes.number,
}

export default connect(mapStateToProps)(UploadForm)