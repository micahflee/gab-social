import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PanelLayout from './panel_layout'

class TrendsRSSPanel extends ImmutablePureComponent {

  render() {
    const {
      intl,
      onChange,
      settings,
    } = this.props

    return (
      <PanelLayout>
      TrendsRSSPanel
      </PanelLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  //
})

TrendsFeedsPanel.propTypes = {
  //
}

export default connect(mapStateToProps)(TrendsRSSPanel)