import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchGabTrends } from '../../actions/news'
import PanelLayout from './panel_layout'
import TrendsItem from '../trends_item'
import TrendsItemPlaceholder from '../placeholder/trends_item_placeholder'

class TrendsBreakingPanel extends ImmutablePureComponent {

  state = {
    fetched: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched && this.props.isLazy) {
      this.props.dispatch(fetchGabTrends())
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.dispatch(fetchGabTrends())
      this.setState({ fetched: true })
    }
  }

  render() {
    const {
      intl,
      isLoading,
      items,
      hideReadMore,
    } = this.props
    const { fetched } = this.state
  
    const count = !!items ? items.count() : 0
    if (count === 0 && fetched) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={!hideReadMore ? intl.formatMessage(messages.readMore) : undefined}
        headerButtonTo='/news#breaking'
        footerButtonTitle={!hideReadMore ? intl.formatMessage(messages.readMore) : undefined}
        footerButtonTo='/news#breaking'
      >
        {
          count > 0 &&
          items.slice(0, 5).map((trend, i) => (
            <TrendsItem key={`gab-trend-panel-${i}`} trend={trend} />
          ))
        }

        {
          count === 0 &&
          <React.Fragment>
            <TrendsItemPlaceholder />
            <TrendsItemPlaceholder />
            <TrendsItemPlaceholder />
            <TrendsItemPlaceholder />
            <TrendsItemPlaceholder />
          </React.Fragment>
        }
      </PanelLayout>
    )
  }
}

const messages = defineMessages({
  title: { id: 'trends.breaking_title', defaultMessage: 'Breaking right now' },
  readMore: { id: 'status.read_more', defaultMessage: 'Read more' },
})

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['news', 'trends_breaking', 'isLoading']),
  isFetched: state.getIn(['news', 'trends_breaking', 'isFetched']),
  items: state.getIn(['news', 'trends_breaking', 'items']),
})

TrendsBreakingPanel.propTypes = {
  intl: PropTypes.object.isRequired,
  isLazy: PropTypes.bool,
  isLoading: PropTypes.bool,
  isFetched: PropTypes.bool,
  items: ImmutablePropTypes.list.isRequired,
  hideReadMore: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps)(TrendsBreakingPanel))