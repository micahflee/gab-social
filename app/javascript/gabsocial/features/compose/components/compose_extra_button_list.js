import React from 'react'
import PropTypes from 'prop-types'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../../../constants'
import Responsive from '../../ui/util/responsive_component'
import ResponsiveClassesComponent from '../../ui/util/responsive_classes_component'
import EmojiPickerButton from './emoji_picker_button'
import PollButton from './poll_button'
import SchedulePostButton from './schedule_post_button'
import SpoilerButton from './spoiler_button'
import ExpiresPostButton from './expires_post_button'
import RichTextEditorButton from './rich_text_editor_button'
import StatusVisibilityButton from './status_visibility_button'
import UploadButton from './media_upload_button'
import { getWindowDimension } from '../../../utils/is_mobile'

const initialState = getWindowDimension()
 
class ComposeExtraButtonList extends React.PureComponent {

  state = {
    height: initialState.height,
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('keyup', this.handleKeyUp, false)
    window.addEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const { height } = getWindowDimension()

    this.setState({ height })
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('resize', this.handleResize, false)
  }
    

  render() {
    const { isMatch, edit, hidePro, isModal } = this.props
    const { height } = this.state

    const small = height <= 660 || isModal

    const containerClasses = CX({
      d: 1,
      w100PC: 1,
      bgPrimary: 1,
      px15: 1,
      py10: 1,
      mtAuto: 1,
      boxShadowBlockY: 1,
      topLeftRadiusSmall: 1,
      borderColorSecondary: 1,
      topRightRadiusSmall: 1,
      flexRow: small,
      overflowXScroll: small,
      noScrollbar: small,
    })

    return (
      <div className={containerClasses}>
        <UploadButton small={small} />
        <EmojiPickerButton isMatch={isMatch} small={small} />
        { !edit && <PollButton small={small} /> }
        <StatusVisibilityButton small={small} />
        <SpoilerButton small={small} />
        { !hidePro && !edit && <SchedulePostButton small={small} /> }
        { !hidePro && !edit && <ExpiresPostButton small={small} /> }
        { !hidePro && <RichTextEditorButton small={small} /> }
      </div>    
    )
  }
}
  
ComposeExtraButtonList.propTypes = {
  hidePro: PropTypes.bool,
  edit: PropTypes.bool,
  isMatch: PropTypes.bool,
  isModal: PropTypes.bool,
}

export default ComposeExtraButtonList
