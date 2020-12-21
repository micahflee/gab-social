import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { length } from 'stringz'
import { countableText } from '../../ui/util/counter'
import { submitCompose } from '../../../actions/compose'
import {
  CX,
  MAX_POST_CHARACTER_COUNT,
} from '../../../constants'
import Button from '../../../components/button'
import Text from '../../../components/text'

class ComposeFormSubmitButton extends React.PureComponent {

  handleSubmit = () => {
    const { formLocation, autoJoinGroup, router, type } = this.props
    const isStandalone = formLocation === 'standalone' || type === 'navigation'
    this.props.onSubmit(router, isStandalone, autoJoinGroup)
  }

  render() {
    const {
      intl,
      title,
      active,
      small,
      type,
      //
      edit,
      text,
      isSubmitting,
      isChangingUpload,
      isUploading,
      anyMedia,
      quoteOfId,
      scheduledAt,
      hasPoll,
      replyToId,
    } = this.props

    const disabledButton = isSubmitting || isUploading || isChangingUpload || length(text) > MAX_POST_CHARACTER_COUNT || (length(text.trim()) === 0 && !anyMedia)

    if (type === 'comment') {
      const commentPublishBtnClasses = CX({
        d: 1,
        jcCenter: 1,
        displayNone: disabledButton,
      })

      return (
        <div className={[_s.d, _s.flexRow, _s.aiStart, _s.mlAuto].join(' ')}>
          <div className={[_s.d, _s.flexRow, _s.mrAuto].join(' ')}>
            <div className={commentPublishBtnClasses}>
              <Button
                isNarrow
                radiusSmall
                onClick={this.handleSubmit}
                isDisabled={disabledButton}
                className={_s.px15}
              >
                {intl.formatMessage(scheduledAt ? messages.schedulePost : messages.post)}
              </Button>
            </div>

          </div>
        </div>
      )
    }

    const btnClasses = CX({
      d: 1,
      radiusSmall: 1,
      noUnderline: 1,
      font: 1,
      cursorPointer: 1,
      textAlignCenter: 1,
      outlineNone: 1,
      bgTransparent: 1,
      flexRow: 1,
      bgSubtle_onHover: !active,
      bgBrandLight: active,
      py10: 1,
      px10: 1,
    })
    
    let backgroundColor, color
    if (disabledButton) {
      backgroundColor = 'tertiary'
      color = 'tertiary'
    } else if (type === 'navigation') {
      backgroundColor = 'white'
      color = 'brand'
    } else {
      backgroundColor = 'brand'
      color = 'white'
    }
    
    return (
      <div className={[_s.d, _s.jcCenter, _s.h40PX].join(' ')}>
        <div className={[_s.d, _s.w100PC].join(' ')}>
          <Button
            isBlock
            radiusSmall
            isDisabled={disabledButton}
            backgroundColor={backgroundColor}
            color={color}
            className={[_s.fs15PX, _s.px15, _s.flexGrow1, _s.mlAuto].join(' ')}
            onClick={this.handleSubmit}
          >
            <Text color='inherit' size='medium' weight='bold' align='center'>
              {intl.formatMessage(scheduledAt ? messages.schedulePost : edit ? messages.postEdit : messages.post)}
            </Text>
          </Button>
        </div>
      </div>
    )
  }

}

const messages = defineMessages({
  post: { id: 'compose_form.post', defaultMessage: 'Post' },
  postEdit: { id: 'compose_form.post_edit', defaultMessage: 'Post Edit' },
  schedulePost: { id: 'compose_form.schedule_post', defaultMessage: 'Schedule Post' },
})

const mapStateToProps = (state) => ({
  edit: state.getIn(['compose', 'id']) !== null,
  text: state.getIn(['compose', 'text']),
  isSubmitting: state.getIn(['compose', 'is_submitting']),
  isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
  isUploading: state.getIn(['compose', 'is_uploading']),
  anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
  quoteOfId: state.getIn(['compose', 'quote_of_id']),
  scheduledAt: state.getIn(['compose', 'scheduled_at']),
  hasPoll: state.getIn(['compose', 'poll']),
  replyToId: state.getIn(['compose', 'in_reply_to']),
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit(router, isStandalone, autoJoinGroup) {
    dispatch(submitCompose({
      router,
      isStandalone,
      autoJoinGroup,
    }))
  }
})

ComposeFormSubmitButton.propTypes = {
  type: PropTypes.oneOf(['header', 'navigation', 'block', 'comment']),
  formLocation: PropTypes.string,
  autoJoinGroup: PropTypes.bool,
  router: PropTypes.object,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ComposeFormSubmitButton))