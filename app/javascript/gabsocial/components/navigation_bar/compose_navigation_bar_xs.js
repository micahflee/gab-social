import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { length } from 'stringz'
import { openPopover } from '../../actions/popover'
import { MAX_POST_CHARACTER_COUNT } from '../../constants'
import Heading from '../heading'
import Button from '../button'
import BackButton from '../back_button'
import Text from '../text'
import ComposeFormSubmitButton from '../../features/compose/components/compose_form_submit_button'

class ComposeNavigationBar extends React.PureComponent {

  handleOnPost = () => {
    // 
  }

  render() {
    const {
      isUploading,
      isChangingUpload,
      isSubmitting,
      anyMedia,
      text,
    } = this.props

    const disabledButton =  isSubmitting || isUploading || isChangingUpload || length(text) > MAX_POST_CHARACTER_COUNT || (length(text.trim()) === 0 && !anyMedia)
 
    return (
      <div className={[_s.d, _s.z4, _s.h53PX, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.h53PX, _s.bgNavigation, _s.aiCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >

          <div className={[_s.d, _s.flexRow, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.w100PC].join(' ')}>

            <BackButton
              toHome
              className={[_s.h53PX, _s.pl10, _s.pr10].join(' ')}
              iconSize='18px'
              iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
            />

            <div className={[_s.d, _s.h53PX, _s.flexRow, _s.jcCenter, _s.aiCenter, _s.mrAuto].join(' ')}>
              <Heading size='h1'>
                <span className={[_s.dangerousContent, _s.fs24PX, _s.colorNavigation].join(' ')}>
                  Compose
                </span>
              </Heading>
            </div>

            <div className={[_s.d, _s.h53PX, _s.flexRow, _s.mlAuto, _s.aiCenter, _s.jcCenter, _s.mr15].join(' ')}>
              <ComposeFormSubmitButton type='navigation' />
            </div>

          </div>

        </div>
      </div>
    )
  }

}

const mapStateToProps = (state, props) => ({
  isUploading: state.getIn(['compose', 'is_uploading']),
  isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
  isSubmitting: state.getIn(['compose', 'is_submitting']),
  anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
  text: state.getIn(['compose', 'text']),
})

const mapDispatchToProps = (dispatch) => ({
  onSubmitCompose() {
    //
  },
})

ComposeNavigationBar.propTypes = {
  isUploading: PropTypes.bool,
  isChangingUpload: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  anyMedia: PropTypes.bool,
  text: PropTypes.string,
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposeNavigationBar)