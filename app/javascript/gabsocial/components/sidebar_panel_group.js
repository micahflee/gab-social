import React from 'react'
import PropTypes from 'prop-types'
import { me, promotions } from '../initial_state'
import Bundle from '../features/ui/util/bundle'
import WrappedBundle from '../features/ui/util/bundle'
import {
  StatusPromotionPanel
} from '../features/ui/util/async_components'

class SidebarPanelGroup extends React.PureComponent {

  render() {
    const { layout, page } = this.props

    if (Array.isArray(promotions) && Array.isArray(layout) && !!me) {
      const sidebarPromotionPageId = `${page}.sidebar`
      const promotion = promotions.find(p => p.timeline_id === sidebarPromotionPageId)

      if (!!promotion) {
        const correctedPosition = promotion.position - 1 > layout.length ? layout.length - 1 : promotion.position
        if (!layout.find(p => p.key === 'status-promotion-panel')) {
          layout.splice(correctedPosition, 0, <WrappedBundle component={StatusPromotionPanel} componentParams={{ statusId: promotion.status_id }} />)
        }
      }
    }

    return (
      <React.Fragment>
        {
          layout.map((panel) => {
            if (!panel) return null

            if (typeof panel !== 'function') {
              return panel
            }

            return (
              <Bundle
                fetchComponent={panel}
                loading={this.renderLoading}
                error={this.renderError}
                renderDelay={150}
              >
                {
                  (Component) => <Component />
                }
              </Bundle>
            )
          })
        }
      </React.Fragment>
    )
  }

}

SidebarPanelGroup.propTypes = {
  layout: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired,
  promotion: PropTypes.object,
}

export default SidebarPanelGroup