import {
  BREAKPOINT_EXTRA_SMALL,
  TIMELINE_INJECTION_FEATURED_GROUPS,
  TIMELINE_INJECTION_GROUP_CATEGORIES,
  TIMELINE_INJECTION_PROGRESS,
  TIMELINE_INJECTION_PRO_UPGRADE,
  TIMELINE_INJECTION_PWA,
  TIMELINE_INJECTION_SHOP,
  TIMELINE_INJECTION_USER_SUGGESTIONS, 
} from '../../constants'
import {
  FeaturedGroupsInjection,
  GroupCategoriesInjection,
  ProgressInjection,
  ProUpgradeInjection,
  PWAInjection,
  ShopInjection,
  UserSuggestionsInjection,
} from '../../features/ui/util/async_components'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Bundle from '../../features/ui/util/bundle'

const INJECTION_COMPONENTS = {}
INJECTION_COMPONENTS[TIMELINE_INJECTION_FEATURED_GROUPS] = FeaturedGroupsInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_GROUP_CATEGORIES] = GroupCategoriesInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_PROGRESS] = ProgressInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_PRO_UPGRADE] = ProUpgradeInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_PWA] = PWAInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_SHOP] = ShopInjection
INJECTION_COMPONENTS[TIMELINE_INJECTION_USER_SUGGESTIONS] = UserSuggestionsInjection

class TimelineInjectionRoot extends React.PureComponent {

  renderLoading = () => {
    return <div />
  }

  renderError = () => {
    return <div />
  }

  render() {
    const { props, type, width } = this.props

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
                {...props}
              />
            )
          }
        </Bundle>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  width: state.getIn(['settings', 'window_dimensions', 'width']),
})
  
TimelineInjectionRoot.propTypes = {
  type: PropTypes.string,
  props: PropTypes.object,
}

TimelineInjectionRoot.defaultProps = {
  props: {},
}

export default connect(mapStateToProps)(TimelineInjectionRoot)