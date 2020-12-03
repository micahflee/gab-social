import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ContentLoader from 'react-content-loader'
import { DEFAULT_THEME } from '../../constants'

class PlaceholderLayout extends React.PureComponent {
  
  render() {
    const {
      intl,
      theme,
      viewBox,
      preserveAspectRatio,
    } = this.props

    const isLight = ['light', 'white', ''].indexOf(theme) > -1
    const title = intl.formatMessage(messages.loading)
    const backgroundColor = !isLight ? '#555' : '#f3f3f3'
    const foregroundColor = !isLight ? '#888' : '#ecebeb'

    return (
      <ContentLoader
        title={title}
        speed={1.25}
        viewBox={viewBox}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        preserveAspectRatio={preserveAspectRatio}
      >
        {this.props.children}
      </ContentLoader>
    )
  }

}

const messages = defineMessages({
  loading: { id: 'loading_indicator.label', defaultMessage: 'Loading...' },
})

const mapStateToProps = (state) => ({
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
})

PlaceholderLayout.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
  preserveAspectRatio: PropTypes.string,
}

export default injectIntl(connect(mapStateToProps)(PlaceholderLayout))
