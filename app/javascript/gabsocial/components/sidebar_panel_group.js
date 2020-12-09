import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { me } from '../initial_state'
import { getPromotions } from '../selectors'
import Bundle from '../features/ui/util/bundle'
import WrappedBundle from '../features/ui/util/wrapped_bundle'
import {
  StatusPromotionPanel
} from '../features/ui/util/async_components'

class SidebarPanelGroup extends React.PureComponent {

  render() {
    const {
      layout,
      page,
      promotions,
    } = this.props

    if (Array.isArray(promotions) && Array.isArray(layout) && !!me) {
      const sidebarPromotionPageId = `${page}.sidebar`
      const promotion = promotions.find((promotion) => promotion.timeline_id === sidebarPromotionPageId)

      if (!!promotion) {
        const correctedPosition = promotion.position - 1 > layout.length ? layout.length - 1 : promotion.position
        if (!layout.find(p => p.key === 'status-promotion-panel')) {
          layout.splice(correctedPosition, 0, <WrappedBundle key='status-promotion-panel' component={StatusPromotionPanel} componentParams={{ statusId: promotion.status_id }} />)
        }
      }
    }

    if (!Array.isArray(layout)) return null

    return (
      <React.Fragment>
        {
          layout.map((panel, i) => {
            if (!panel) return null

            if (typeof panel !== 'function' || panel.key === 'status-promotion-panel') {
              return panel
            }

            return (
              <Bundle
                key={`sidebar-panel-group-item-${i}`}
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

const mapStateToProps = (state) => ({
  promotions: getPromotions()(state)
})

SidebarPanelGroup.propTypes = {
  layout: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired,
  promotion: PropTypes.object,
}

export default connect(mapStateToProps)(SidebarPanelGroup)