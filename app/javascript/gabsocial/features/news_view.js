import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TRENDS_RSS_SOURCES } from '../constants'
import WrappedBundle from './ui/util/wrapped_bundle'
import { TrendsRSSPanel } from './ui/util/async_components'
import ColumnIndicator from '../components/column_indicator'

class NewsView extends React.PureComponent {
  
  render() {
    const { params: { trendsRSSId } } = this.props
    console.log("trendsRSSId:", trendsRSSId)
    const exists = !!TRENDS_RSS_SOURCES.find((block) => block.id === trendsRSSId)

    if (!exists) return <ColumnIndicator type='missing' />

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <WrappedBundle component={TrendsRSSPanel} />
      </div>
    )
  }

}

export default NewsView