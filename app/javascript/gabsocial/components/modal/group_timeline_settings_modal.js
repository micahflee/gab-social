import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'

class GroupTimelineSettingsModal extends React.PureComponent {

  render() {
    const { intl } = this.props

    return (
      <div/>
    )
  }
}

GroupTimelineSettingsModal.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default injectIntl(GroupTimelineSettingsModal)