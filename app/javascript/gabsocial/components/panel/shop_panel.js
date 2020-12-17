import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { fetchFeaturedProducts } from '../../actions/shop'
import { URL_DISSENTER_SHOP } from '../../constants'
import PanelLayout from './panel_layout'
import ShopItem from '../shop_item'

class ShopPanel extends React.PureComponent {

  state = {
    fetched: !this.props.isLazy,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.onFetchFeaturedProducts()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.onFetchFeaturedProducts()
    }
  }

  render() {
    const {
      intl,
      items,
      isError,
    } = this.props

    if (!items || isError || !Array.isArray(items)) return <div />
    if (items.length <= 0) return <div />

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        footerButtonTitle={intl.formatMessage(messages.shop_now)}
        footerButtonHref={URL_DISSENTER_SHOP}
      >
        <div className={[_s.d, _s.flexRow, _s.flexWrap, _s.pl5, _s.pt5].join(' ')}>
          {
            items.map((block, i) => (
              <ShopItem
                key={`shop-item-${i}`}
                image={block.image}
                name={block.name}
                link={block.link}
                price={block.price}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}

const messages = defineMessages({
  title: { id: 'shop_panel.title', defaultMessage: 'Dissenter Shop' },
  shop_now: { id: 'shop_panel.shop_now', defaultMessage: 'Visit the Dissenter Shop' },
})

const mapStateToProps = (state) => ({
  items: state.getIn(['shop', 'featured', 'items']),
  isError: state.getIn(['shop', 'featured', 'isError']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchFeaturedProducts: () => dispatch(fetchFeaturedProducts()),
})

ShopPanel.propTypes = {
  intl: PropTypes.object.isRequired,
  products: PropTypes.array,
  isLazy: PropTypes.bool,
  onFetchFeaturedProducts: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ShopPanel))