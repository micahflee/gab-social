import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { changeComposeSpoilerness } from '../../../actions/compose'
import ComposeExtraButton from './compose_extra_button'

class SpoilerButton extends React.PureComponent {

  handleClick = (e) => {
    e.preventDefault()
    this.props.onClick()
  }

  render () {
    const { active, intl, small } = this.props

    return (
      <ComposeExtraButton
        title={intl.formatMessage(messages.title)}
        icon='warning'
        onClick={this.handleClick}
        small={small}
        active={active}
        iconClassName={_s.cIconComposeSpoiler}
      />
    )
  }

}

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
  title: { id: 'compose_form.spoiler.title', defaultMessage: 'Warning' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['compose', 'spoiler']),
})

const mapDispatchToProps = (dispatch) => ({
  onClick () {
    dispatch(changeComposeSpoilerness())
  },
})

SpoilerButton.propTypes = {
  active: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  small: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SpoilerButton))