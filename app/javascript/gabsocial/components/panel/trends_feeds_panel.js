import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { TRENDS_RSS_SOURCES } from '../../constants'
import PanelLayout from './panel_layout'
import Button from '../button'
import Text from '../text'

class TrendsFeedsPanel extends ImmutablePureComponent {

  render() {
    return (
      <PanelLayout
        title='All News Feeds'
        subtitle='Click on each one to see a feed of each'
      >
        <div className={[_s.d, _s.flexRow, _s.flexWrap].join(' ')}>
          {
            TRENDS_RSS_SOURCES.map((block, i) => (
              <Button
                isNarrow
                to={`/news/view/${block.id}`}
                color='primary'
                backgroundColor='tertiary'
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
      </PanelLayout>
    )
  }

}

export default TrendsFeedsPanel