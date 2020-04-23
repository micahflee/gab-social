import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import Button from './button'

const messages = defineMessages({
  gab: { id: 'gab', defaultMessage: 'Gab' }, 
})

const mapDispatchToProps = (dispatch) => ({
  onOpenCompose: () => dispatch(openModal('COMPOSE')),
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class FloatingActionButton extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.message !== this.props.message
  }

  render() {
    const { intl, onOpenCompose } = this.props

    const message = intl.formatMessage(messages.gab)

    return (
      <Button
        onClick={onOpenCompose}
        color='white'
        backgroundColor='brand'
        className={[_s.posFixed, _s.z4, _s.py15, _s.mb15, _s.mr15, _s.bottom0, _s.right0].join(' ')}
        title={message}
        aria-label={message}
        icon='pencil'
      />
    )
  }
}