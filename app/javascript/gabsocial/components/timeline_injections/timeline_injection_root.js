import {
  BREAKPOINT_EXTRA_SMALL,
  TIMELINE_INJECTION_FEATURED_GROUPS,
  TIMELINE_INJECTION_GROUP_CATEGORIES,
  TIMELINE_INJECTION_PRO_UPGRADE,
  TIMELINE_INJECTION_PWA,
  TIMELINE_INJECTION_SHOP,
  TIMELINE_INJECTION_USER_SUGGESTIONS, 
} from '../../constants'
import {
  FeaturedGroupsInjection,
  GroupCategoriesInjection,
  ProUpgradeInjection,
  PWAInjection,
  ShopInjection,
  UserSuggestionsInjection,
} from '../../features/ui/util/async_components'

import React from 'react'
import PropTypes from 'prop-types'
import { getWindowDimension } from '../../utils/is_mobile'
import Bundle from '../../features/ui/util/bundle'

const initialState = getWindowDimension()

const INJECTION_COMPONENTS = {}
INJECTION_COMPONENTS[TIMELINE_INJECTION_FEATURED_GROUPS] = FeaturedGroupsInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_GROUP_CATEGORIES] = GroupCategoriesInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_PRO_UPGRADE] = ProUpgradeInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_PWA] = PWAInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_SHOP] = ShopInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_USER_SUGGESTIONS] = UserSuggestionsInjection

class TimelineInjectionRoot extends React.PureComponent {

  state = {
    width: initialState.width,
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
  }

  renderLoading = () => {
    return <div />
  }

  renderError = () => {
    return <div />
  }

  render() {
    const { type } = this.props
    const { width } = this.state

    const visible = !!type

    if (!visible) return <div />

    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    //If is not XS and popover is pwa, dont show
    //Since not on mobile this should not be visible
    if (!isXS && type === TIMELINE_INJECTION_PWA) return <div />

    return (
      <div>
        <Bundle
          fetchComponent={INJECTION_COMPONENTS[type]}
          loading={this.renderLoading}
          error={this.renderError}
          renderDelay={150}
        >
          {
            (Component) => (
              <Component
                isXS={isXS}
                injectionId={type}
              />
            )
          }
        </Bundle>
      </div>
    )
  }

}

TimelineInjectionRoot.propTypes = {
  type: PropTypes.string,
}

export default TimelineInjectionRoot