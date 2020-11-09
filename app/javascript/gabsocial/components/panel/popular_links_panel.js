import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchPopularLinks } from '../../actions/links'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PanelLayout from './panel_layout'
import PreviewCardItem from '../preview_card_item'

class PopularLinksPanel extends ImmutablePureComponent {

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
      this.props.dispatch(fetchPopularLinks())
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.dispatch(fetchPopularLinks())
      this.setState({ fetched: true })
    }
  }

  render() {
    const {
      intl,
      popularLinksIsLoading,
      popularLinksItems,
    } = this.props
    const { fetched } = this.state
  
    const count = !!popularLinksItems ? popularLinksItems.count() : 0
    if (count === 0 && fetched) return null

    return (
      <PanelLayout
        title='Trending Links on Gab'
        subtitle='Most popular links on Gab in last 15 minutes'
      >
        <div className={[_s.d, _s.w100PC].join(' ')}>
          {
            popularLinksItems.map((id, i) => (
              <PreviewCardItem id={id} key={`preview-card-${id}-${i}`} />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  popularLinksIsLoading: state.getIn(['links', 'popular', 'isLoading']),
  popularLinksItems: state.getIn(['links', 'popular', 'items']),
})

PopularLinksPanel.propTypes = {
  popularLinksIsLoading: PropTypes.bool.isRequired,
  popularLinksItems: ImmutablePropTypes.list.isRequired,
}

export default connect(mapStateToProps)(PopularLinksPanel)