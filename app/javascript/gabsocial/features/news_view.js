import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TRENDS_RSS_SOURCES } from '../constants'
import WrappedBundle from './ui/util/wrapped_bundle'
import { TrendsRSSPanel } from './ui/util/async_components'
import Button from '../components/button'
import ColumnIndicator from '../components/column_indicator'
import Text from '../components/text'

class NewsView extends React.PureComponent {
  
  state = {
    exists: false,
    orderedSources: [],
  }

  componentDidMount() {
    const { params: { trendsRSSId } } = this.props
    this.setState({
      exists: this.getExists(trendsRSSId),
      orderedSources: this.getOrderedSources(trendsRSSId)
    })
  }

  componentDidUpdate(prevProps) {
    const { params: { trendsRSSId } } = this.props
    if (prevProps.params.trendsRSSId !== trendsRSSId) {
      this.setState({
        exists: this.getExists(trendsRSSId),
        orderedSources: this.getOrderedSources(trendsRSSId),
      })
    }
  }

  getExists = (trendsRSSId) => {
    return !!TRENDS_RSS_SOURCES.find((source) => source.id === trendsRSSId)
  }

  getOrderedSources = (trendsRSSId) => {
    const source = TRENDS_RSS_SOURCES.find((source) => source.id === trendsRSSId)
    const sourceIndex = TRENDS_RSS_SOURCES.findIndex((source) => source.id === trendsRSSId)
    if (!source) return []
    let orderedSources = TRENDS_RSS_SOURCES.filter((source) => source.id !== trendsRSSId);
    const activeSource = { ...source, isActive: 1 }
    orderedSources[sourceIndex] = activeSource
    orderedSources.unshift(activeSource);
    return orderedSources
  }

  render() {
    const { params: { trendsRSSId } } = this.props
    const { orderedSources, exists } = this.state

    if (!exists) return <ColumnIndicator type='missing' />

    return (
      <div className={[_s.d, _s.w100PC].join(' ')}>
        <div className={[_s.d, _s.flexRow, _s.w100PC, _s.overflowXScroll, _s.py10, _s.px10, _s.mb5].join(' ')}>
          {
            orderedSources.map((block, i) => (
              <Button
                isNarrow
                to={block.isActive ? undefined : `/news/view/${block.id}`}
                color={block.isActive ? 'white' : 'primary'}
                backgroundColor={block.isActive ? 'brand' : 'tertiary'}
                className={[_s.mr10, _s.mb10].join(' ')}
                key={`trends-feeds-panel-${i}`}
              >
                <Text color='inherit'>
                  {block.title}
                </Text>
              </Button>
            ))
          }
        </div>
      
        <WrappedBundle component={TrendsRSSPanel} componentParams={{ trendsRSSId }}  />
      </div>
    )
  }

}

export default NewsView