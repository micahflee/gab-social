import { injectIntl, defineMessages } from 'react-intl'
import { changeRichTextEditorControlsVisibility } from '../../../actions/compose'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
  title: { id: 'compose_form.spoiler.title', defaultMessage: 'Warning' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['compose', 'rte_controls_visible']),
})

const mapDispatchToProps = (dispatch) => ({

  onClick (status) {
    dispatch(changeRichTextEditorControlsVisibility(status))
  },

})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class RichTextEditorButton extends PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    small: PropTypes.bool,
  }

  handleClick = (e) => {
    e.preventDefault()
    this.props.onClick()
  }

  render () {
    const { active, intl, small } = this.props

    return (
      <ComposeExtraButton
        title={intl.formatMessage(messages.title)}
        icon='rich-text'
        onClick={this.handleClick}
        small={small}
        active={active}
      />
    )
  }

}
