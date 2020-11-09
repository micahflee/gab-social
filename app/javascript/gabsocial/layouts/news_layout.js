import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import Layout from './layout'
import Responsive from '../features/ui/util/responsive_component'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'

class NewsLayout extends ImmutablePureComponent {

  render() {
    const {
      children,
      showBackBtn,
      title,
    } = this.props

    const mainBlockClasses = CX({
      d: 1,
      w1015PX: 1,
      h100PC: 1,
      flexRow: 1,
      jcEnd: 1,
    })

    return (
      <Layout
        showBackBtn
        showGlobalFooter
        noRightSidebar
        showLinkFooterInSidebar
        page='news'
        title={title}
      >
        <div className={[_s.d, _s.flexRow, _s.w100PC].join(' ')}>
          {children}
        </div>
      </Layout>
    )
  }

}

NewsLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
}

export default NewsLayout