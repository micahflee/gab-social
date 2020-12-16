import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { undoUploadCompose, changeUploadCompose } from '../../../actions/compose'
import { submitCompose } from '../../../actions/compose'
import { CX } from '../../../constants'
import Button from '../../../components/button'
import Image from '../../../components/image'
import Input from '../../../components/input'
import Text from '../../../components/text'

class Upload extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  state = {
    hovering: false,
    focused: false,
    dirtyDescription: null,
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit()
    }
  }

  handleSubmit = () => {
    this.handleInputBlur()
    this.props.onSubmit()
  }

  handleUndoClick = (e) => {
    e.stopPropagation()
    this.props.onUndo(this.props.media.get('id'))
  }

  handleInputChange = (value) => {
    this.setState({ dirtyDescription: value })
  }

  handleMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false })
  }

  handleInputFocus = () => {
    this.setState({ focused: true })
  }

  handleClick = () => {
    this.setState({ focused: true })
  }

  handleInputBlur = () => {
    const { dirtyDescription } = this.state

    this.setState({
      focused: false,
      dirtyDescription: null,
    })

    if (dirtyDescription !== null) {
      this.props.onDescriptionChange(this.props.media.get('id'), dirtyDescription)
    }
  }

  render() {
    const { intl, media } = this.props
    const { hovering } = this.state

    const active = hovering || this.state.focused
    const description = this.state.dirtyDescription || (this.state.dirtyDescription !== '' && media.get('description')) || ''

    return (
      <div
        tabIndex='0'
        className={[_s.d, _s.w100PC, _s.mt10].join(' ')}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        role='button'
      >
        <div className={[_s.d, _s.radiusSmall, _s.borderColorSecondary, _s.border1PX, _s.overflowHidden, _s.maxH100VH, _s.minH106PX].join(' ')}>
          <Image
            className={[_s.d, _s.minH106PX, _s.maxH100VH].join(' ')}
            src={media.get('preview_url')}
          />
          { hovering && <div className={[_s.d, _s.posAbs, _s.z2, _s.top0, _s.bottom0, _s.right0, _s.left0, _s.bgBlackOpaquest].join(' ')} /> }
          {
            media.get('type') === 'gifv' &&
            <div className={[_s.d, _s.posAbs, _s.z3, _s.radiusSmall, _s.bgBlackOpaque, _s.px5, _s.py5, _s.ml10, _s.mt10, _s.bottom0, _s.right0].join(' ')}>
              <Text size='extraSmall' color='white' weight='medium'>GIF</Text>
            </div>
          }
          <div className={[_s.d, _s.posAbs, _s.px15, _s.pt15, _s.z3, _s.flexRow, _s.top0, _s.left0, _s.right0].join(' ')}>
            {
              active &&
              <div className={[_s.d, _s.flexGrow1, _s.mr15].join(' ')}>
                <Input
                  small
                  hideLabel
                  id={`input-${media.get('id')}`}
                  title={intl.formatMessage(messages.description)}
                  placeholder={intl.formatMessage(messages.description)}
                  value={description}
                  maxLength={420}
                  onFocus={this.handleInputFocus}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputBlur}
                  onKeyDown={this.handleKeyDown}
                />
              </div>
            }
            <Button
              backgroundColor='black'
              color='white'
              title={intl.formatMessage(messages.delete)}
              onClick={this.handleUndoClick}
              icon='close'
              iconSize='10px'
              iconClassName={_s.inherit}
              className={[_s.mlAuto, _s.px10].join(' ')}
            />
          </div>
        </div>
      </div>
    )
  }

}

const messages = defineMessages({
  description: { id: 'upload_form.description', defaultMessage: 'Describe for the visually impaired' },
  delete: { id: 'upload_form.undo', defaultMessage: 'Delete' },
})

const mapStateToProps = (state, { id }) => ({
  media: state.getIn(['compose', 'media_attachments']).find(item => item.get('id') === id),
})

const mapDispatchToProps = (dispatch) => ({
  onUndo: (id) => {
    dispatch(undoUploadCompose(id))
  },
  onDescriptionChange: (id, description) => {
    dispatch(changeUploadCompose(id, { description }))
  },
  onSubmit () {
    dispatch(submitCompose())
  },
});

Upload.propTypes = {
  media: ImmutablePropTypes.map.isRequired,
  intl: PropTypes.object.isRequired,
  onUndo: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Upload))