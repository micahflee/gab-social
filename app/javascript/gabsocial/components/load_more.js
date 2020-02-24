import { injectIntl, defineMessages } from 'react-intl'
import Icon from './icon'

const messages = defineMessages({
  load_more: { id: 'status.load_more', defaultMessage: 'Load more' },
})

export default
@injectIntl
class LoadMore extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
    maxId: PropTypes.string,
    gap: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: true,
  }

  handleClick = () => {
    const { gap, maxId } = this.props
    this.props.onClick(gap ? maxId : undefined)
  }

  render() {
    const { disabled, visible, gap, intl } = this.props

    return (
      <button
        className={[_s.default].join(' ')}
        disabled={disabled || !visible}
        style={{ visibility: visible ? 'visible' : 'hidden' }}
        onClick={this.handleClick}
        aria-label={intl.formatMessage(messages.load_more)}
      >
        {!gap && intl.formatMessage(messages.load_more)}
        {gap && <Icon id='ellipsis-h' />}
      </button>
    )
  }

}