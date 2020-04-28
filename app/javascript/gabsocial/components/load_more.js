import { injectIntl, defineMessages } from 'react-intl'
import Button from './button'
import Text from './text'

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
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: true,
  }

  handleClick = (e) => {
    this.props.onClick()
  }

  render() {
    const {
      disabled,
      visible,
      intl,
    } = this.props

    return (
      <div className={[_s.default, _s.py10, _s.px10].join(' ')}>
        <Button
          isBlock
          radiusSmall
          backgroundColor='tertiary'
          color='primary'
          disabled={disabled || !visible}
          style={{
            visibility: visible ? 'visible' : 'hidden',
          }}
          onClick={this.handleClick}
          aria-label={intl.formatMessage(messages.load_more)}
        >
          <Text color='inherit' align='center'>
            {intl.formatMessage(messages.load_more)}
          </Text>
        </Button>
      </div>
    )
  }

}