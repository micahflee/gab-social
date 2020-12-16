import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { changeComposeVisibility } from '../../actions/compose'
import { closePopover } from '../../actions/popover'
import { CX } from '../../constants'
import PopoverLayout from './popover_layout'
import Icon from '../icon'
import Text from '../text'

class StatusVisibilityDropdown extends React.PureComponent {

  handleChange = (value) => {
    this.props.onChange(value)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render () {
    const { intl, value, isXS } = this.props

    const options = [
      {
        icon: 'globe',
        value: 'public',
        title: intl.formatMessage(messages.public_short),
        subtitle: intl.formatMessage(messages.public_long)
      },
      {
        icon: 'unlock-filled',
        value: 'unlisted',
        title: intl.formatMessage(messages.unlisted_short),
        subtitle: intl.formatMessage(messages.unlisted_long)
      },
      {
        icon: 'lock-filled',
        value: 'private',
        title: intl.formatMessage(messages.private_short),
        subtitle: intl.formatMessage(messages.private_long)
      },
    ]

    return (
      <PopoverLayout
        width={300}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <Text className={[_s.d, _s.px15, _s.py10, _s.bgSecondary].join(' ')}>Status Visibility:</Text>
        <div className={[_s.d].join(' ')}>
          {
            options.map((option, i) => {
              const isActive = option.value === value
              const isLast = i === options.length - 1

              const containerClasses = CX({
                d: 1,
                flexRow: 1,
                py10: 1,
                cursorPointer: 1,
                borderBottom1PX: !isLast,
                borderColorSecondary: !isLast,
                bgSubtle_onHover: !isActive,
                bgBrand: isActive,
              })

              const iconClasses = CX({
                ml10: 1,
                mt2: 1,
                cPrimary: !isActive,
                cWhite: isActive,
              })

              return (
                <div
                  role='button'
                  onClick={() => this.handleChange(option.value)}
                  className={containerClasses}
                >
                  <Icon id={option.icon} size='16px' className={iconClasses} />
                  <div className={[_s.d, _s.px10, _s.pt2].join(' ')}>
                    <Text size='medium' color={isActive ? 'white' : 'primary'}>
                      {option.title}
                    </Text>
                    <Text size='small' weight='medium' color={isActive ? 'white' : 'secondary'}>
                      {option.subtitle}
                    </Text>
                  </div>
                </div>
              )
            })
          }
        </div>
      </PopoverLayout>
    )
  }

}

const messages = defineMessages({
  public_short: { id: 'privacy.public.short', defaultMessage: 'Public' },
  public_long: { id: 'privacy.public.long', defaultMessage: 'Visible for anyone on or off Gab' },
  unlisted_short: { id: 'privacy.unlisted.short', defaultMessage: 'Unlisted' },
  unlisted_long: { id: 'privacy.unlisted.long', defaultMessage: 'Do not show in public timelines' },
  private_short: { id: 'privacy.private.short', defaultMessage: 'Followers-only' },
  private_long: { id: 'privacy.private.long', defaultMessage: 'Visible for your followers only' },
  change_privacy: { id: 'privacy.change', defaultMessage: 'Adjust status privacy' },
  visibility: { id: 'privacy.visibility', defaultMessage: 'Visibility' },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['compose', 'privacy']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange (value) {
    dispatch(changeComposeVisibility(value))
    dispatch(closePopover())
  },
  onClosePopover: () => dispatch(closePopover()),
})

StatusVisibilityDropdown.propTypes = {
  intl: PropTypes.object.isRequired,
  isXS: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClosePopover: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(StatusVisibilityDropdown))