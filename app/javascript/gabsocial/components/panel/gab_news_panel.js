import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchGabNews } from '../../actions/news'
import PanelLayout from './panel_layout'
import NewsItem from '../news_item'

class GabNewsPanel extends ImmutablePureComponent {

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
      this.props.dispatch(fetchGabNews())
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.dispatch(fetchGabNews())
      this.setState({ fetched: true })
    }
  }

  render() {
    const {
      intl,
      isLoading,
      items,
    } = this.props
    const { fetched } = this.state

    const count = !!items ? items.count() : 0
    if (count === 0 && fetched) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.readMore)}
        headerButtonHref='https://news.gab.com'
        footerButtonTitle={intl.formatMessage(messages.readMore)}
        footerButtonHref='https://news.gab.com'
      >
        <div className={[_s.d, _s.borderTop1PX, _s.borderBottom1PX, _s.borderColorSecondary, _s.flexRow, _s.w100PC, _s.overflowXScroll, _s.py15, _s.pl15].join(' ')}>
          {
            count > 0 &&
            items.slice(0, 5).map((news, i) => (
              <NewsItem news={news} key={`news-panel-item-${i}`} />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}

const messages = defineMessages({
  title: { id: 'gab_news.title', defaultMessage: 'Gab News' },
  readMore: { id: 'status.read_more', defaultMessage: 'Read more' },
})

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['news', 'gab_news', 'isLoading']),
  isFetched: state.getIn(['news', 'gab_news', 'isFetched']),
  items: state.getIn(['news', 'gab_news', 'items']),
})

GabNewsPanel.propTypes = {
  intl: PropTypes.object.isRequired,
  isLazy: PropTypes.bool,
  isLoading: PropTypes.bool,
  isFetched: PropTypes.bool,
  items: ImmutablePropTypes.list.isRequired,
}

export default injectIntl(connect(mapStateToProps)(GabNewsPanel))