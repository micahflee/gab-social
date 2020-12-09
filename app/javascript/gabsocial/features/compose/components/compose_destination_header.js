import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { length } from 'stringz'
import { isMobile } from '../../../utils/is_mobile'
import { countableText } from '../../ui/util/counter'
import {
  CX,
  MAX_POST_CHARACTER_COUNT,
  ALLOWED_AROUND_SHORT_CODE,
  BREAKPOINT_EXTRA_SMALL,
  BREAKPOINT_EXTRA_EXTRA_SMALL,
  BREAKPOINT_MEDIUM,
} from '../../../constants'
import AutosuggestTextbox from '../../../components/autosuggest_textbox'
import Responsive from '../../ui/util/responsive_component'
import ResponsiveClassesComponent from '../../ui/util/responsive_classes_component'
import Avatar from '../../../components/avatar'
import Button from '../../../components/button'
import EmojiPickerButton from './emoji_picker_button'
import PollButton from './poll_button'
import PollForm from './poll_form'
import SchedulePostButton from './schedule_post_button'
import SpoilerButton from './spoiler_button'
import ExpiresPostButton from './expires_post_button'
import RichTextEditorButton from './rich_text_editor_button'
import StatusContainer from '../../../containers/status_container'
import StatusVisibilityButton from './status_visibility_button'
import UploadButton from './media_upload_button'
import UploadForm from './upload_form'
import Input from '../../../components/input'
import Text from '../../../components/text'
import Icon from '../../../components/icon'
import ComposeExtraButtonList from './compose_extra_button_list'

class ComposeDestinationHeader extends ImmutablePureComponent {

  handleOnClick = () => {

  }

  render() {
    const { account } = this.props

    const title = 'Post to timeline'

    return (
      <div className={[_s.d, _s.flexRow, _s.aiCenter, _s.bgPrimary, _s.borderBottom1PX, _s.borderTop1PX, _s.borderColorSecondary, _s.mb5, _s.mt5, _s.px15, _s.w100PC, _s.h40PX].join(' ')}>
        <Avatar account={account} size={28} />
        <div className={[_s.ml15].join(' ')}>
          <Button
            isNarrow
            radiusSmall
            backgroundColor='tertiary'
            color='primary'
            onClick={this.handleOnClick}
          >
            <Text color='inherit' size='small' className={_s.jcCenter}>
              {title}
              <Icon id='caret-down' size='8px' className={_s.ml5} />
            </Text>
          </Button>
        </div>
      </div>
    )
  }
}

ComposeDestinationHeader.propTypes = {
  account: ImmutablePropTypes.map,
}

export default ComposeDestinationHeader