import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { changeComposeSensitivity } from '../../../actions/compose'
import Switch from '../../../components/switch'

class SensitiveMediaButton extends React.PureComponent {

  render () {
    const { active, disabled, onClick, intl } = this.props

    return (
      <div className={[_s.d, _s.aiStart, _s.px5, _s.py10].join(' ')}>
        <Switch
          id='mark-sensitive'
          type='checkbox'
          checked={active}
          onChange={onClick}
          disabled={disabled}
          label={intl.formatMessage(messages.markAsSensitive)}
        />
      </div>
    )
  }

}

const messages = defineMessages({
  markAsSensitive: { id: 'compose_form.sensitive.hide', defaultMessage: 'Mark media as sensitive' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['compose', 'sensitive']),
  disabled: state.getIn(['compose', 'spoiler']),
})

const mapDispatchToProps = (dispatch) => ({

  onClick () {
    dispatch(changeComposeSensitivity())
  },

})

SensitiveMediaButton.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SensitiveMediaButton))