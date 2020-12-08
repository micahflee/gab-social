import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openPopover } from '../../actions/popover'
import {
  CX,
  POPOVER_TIMELINE_INJECTION_OPTIONS,
} from '../../constants'
import Button from '../button'
import Text from '../text'

class TimelineInjectionLayout extends React.PureComponent {

  state = {
    dismissed: false,
  }

  handleOnOptionsClick = () => {
    this.props.dispatch(openPopover(POPOVER_TIMELINE_INJECTION_OPTIONS, {
      targetRef: this.optionsBtn,
      timelineInjectionId: this.props.id,
      onDismiss: this.handleOnDismiss,
    }))
  }

  handleOnDismiss = () => {
    this.setState({ dismissed: true })
  }

  setOptionsBtn = (n) => {
    this.optionsBtn = n
  }

  render() {
    const {
      title,
      subtitle,
      children,
      buttonLink,
      buttonHref,
      buttonTitle,
      isXS,
      isDeckConnected,
    } = this.props
    const { dismissed } = this.state

    if (dismissed) return <div />

    const containerClasses = CX({
      d: 1,
      w100PC: 1,
      mb10: 1,
      borderTop1PX: isXS,
      borderBottom1PX: isXS,
      border1PX: !isXS,
      radiusSmall: !isXS && !isDeckConnected,
      borderColorSecondary: 1,
      bgPrimary: 1,
      overflowHidden: 1,
    })

    return (
      <div className={containerClasses}>
        <div className={[_s.d, _s.px15, _s.py5, _s.flexRow, _s.jcCenter, _s.aiCenter].join(' ')}>
          <div className={[_s.d, _s.pr10].join(' ')}>
            <Text size='medium'>
              {title}
            </Text>
            {
              !!subtitle &&
              <Text size='small' weight='medium' color='secondary' className={[_s.pt5, _s.pb10].join(' ')}>
                {subtitle}
              </Text>
            }
          </div>
          <Button
            backgroundColor='none'
            color='secondary'
            iconSize='16px'
            icon='ellipsis'
            onClick={this.handleOnOptionsClick}
            buttonRef={this.setOptionsBtn}
            className={[_s.mlAuto].join(' ')}
          />
        </div>
        <div className={[_s.d, _s.px10, _s.flexRow, _s.width100PC, _s.overflowHidden, _s.overflowXScroll, _s.noScrollbar, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          {children}
        </div>
        <div className={_s.d}>
          <Button
            isText
            color='none'
            backgroundColor='none'
            to={buttonLink}
            href={buttonHref}
            className={[_s.px15, _s.py15, _s.bgSubtle_onHover].join(' ')}
          >
            <Text color='brand' align='center' size='medium'>
              {buttonTitle}
            </Text>
          </Button>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  isDeckConnected: state.getIn(['deck', 'connected'], false),
})

TimelineInjectionLayout.propTypes = {
  title: PropTypes.string,
  buttonLink: PropTypes.string,
  buttonHref: PropTypes.string,
  buttonTitle: PropTypes.string,
  id: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  isXS: PropTypes.bool,
  isDeckConnected: PropTypes.bool,
}

export default connect(mapStateToProps)(TimelineInjectionLayout)