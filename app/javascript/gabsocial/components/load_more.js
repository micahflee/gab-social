import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, defineMessages } from 'react-intl'
import Button from './button'
import Text from './text'

class LoadMore extends React.PureComponent {

  handleClick = (e) => {
    this.props.onClick(e)
  }

  render() {
    const {
      disabled,
      visible,
      intl,
    } = this.props

    if (!visible || disabled) return null

    return (
      <div className={[_s.d, _s.py15, _s.px10].join(' ')}>
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
          <Text color='inherit' align='center' weight='medium' className={_s.py5}>
            {intl.formatMessage(messages.load_more)}
          </Text>
        </Button>
      </div>
    )
  }

}

const messages = defineMessages({
  load_more: { id: 'status.load_more', defaultMessage: 'Load more' },
})


LoadMore.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  intl: PropTypes.object.isRequired,
}

LoadMore.defaultProps = {
  visible: true,
}

export default injectIntl(LoadMore)