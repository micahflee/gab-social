import React from 'react'
import PropTypes from 'prop-types'
import { me } from '../initial_state'
import DefaultSidebar from '../components/sidebar/default_sidebar'
import ComposeNavigationBar from '../components/navigation_bar/compose_navigation_bar_xs'
import Responsive from '../features/ui/util/responsive_component'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  SidebarXS,
} from '../features/ui/util/async_components'

class ComposeLayout extends React.PureComponent {

  render() {
    const { children, isXS } = this.props

    if (!isXS) return null

    return (
      <div className={[_s.d, _s.w100PC, _s.minH100VH, _s.bgTertiary].join(' ')}>
        <WrappedBundle component={SidebarXS} />

        <ComposeNavigationBar />

        <main role='main' className={[_s.d, _s.w100PC, _s.flexGrow1].join(' ')}>
          { children }
        </main>
      </div>
    )
  }

}

ComposeLayout.propTypes = {
  children: PropTypes.node,
}

export default ComposeLayout