import { defineMessages, injectIntl } from 'react-intl'
import { me } from '../initial_state'
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

    if (!me) return null

    const message = intl.formatMessage(messages.gab)

    return (
      <Button
        onClick={onOpenCompose}
        className={[_s.posFixed, _s.z4, _s.py15, _s.mb15, _s.mr15, _s.bottom55PX, _s.height60PX, _s.width60PX, _s.right0, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}
        title={message}
        aria-label={message}
        icon='pencil'
        iconSize='20px'
      />
    )
  }
  
}