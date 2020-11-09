import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { CX } from '../../constants'
import PanelLayout from './panel_layout'
import Button from '../button'
import Text from '../text'
import Image from '../image'

// depends on TrendsBreakingPanel atm.
class TrendsHeadlinesPanel extends ImmutablePureComponent {

  render() {
    const {
      isFetched,
      isLoading,
      items,
      trendsLeadline,
    } = this.props
  
    const count = !!items ? items.count() : 0
    const trendsLeadlineTitle = trendsLeadline ? trendsLeadline.get('title') : null
    const trendsLeadlineImage = trendsLeadline ? trendsLeadline.get('image') : null
    const trendsLeadlineUrl = trendsLeadline ? trendsLeadline.get('trends_url') : null

    if ((count === 0 && isFetched) && (!trendsLeadlineImage || !trendsLeadlineTitle || !trendsLeadlineTitle)) return null

    const leadlineButtonClasses = CX({
      d: 1,
      cursorPointer: 1,
      noUnderline: 1,
      bgPrimary: 1,
      w100PC: 1,
      border1PX: 1,
      borderColorSecondary: 1,
      radiusSmall: 1,
      overflowHidden: 1,
      bgSubtle_onHover: 1,
      mb5: 1,
      mt10: count > 0,
    })

    return (
      <PanelLayout
        title='Headlines'
        subtitle='Breaking headlines from Gab Trends'
      >
        {
          count > 0 &&
          items.slice(0, 5).map((headline, i) => (
            <Button
              isText
              backgroundColor='none'
              color='primary'
              className={[_s.d, _s.pb15].join(' ')}
              href={headline.get('trends_url')}
              key={`headline-news-item-${i}`}
            >
              <Text color='inherit' size='small'>
                {headline.get('title')}
              </Text>
            </Button>
          ))
        }
        {
          !!trendsLeadlineImage && !!trendsLeadlineTitle && trendsLeadlineUrl &&
          <Button
            noClasses
            href={trendsLeadlineUrl}
            className={leadlineButtonClasses}
          >
            <Image
              src={trendsLeadlineImage}
            />
            <Text className={[_s.px15, _s.py15, _s.w100PC, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
              {trendsLeadlineTitle}
            </Text>
          </Button>
        }
      </PanelLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['news', 'trends_headlines', 'isLoading']),
  isFetched: state.getIn(['news', 'trends_headlines', 'isFetched']),
  items: state.getIn(['news', 'trends_headlines', 'items']),
  trendsLeadline: state.getIn(['news', 'trends_leadline', 'items']),
})

TrendsHeadlinesPanel.propTypes = {
  isLoading: PropTypes.bool,
  isFetched: PropTypes.bool,
  items: ImmutablePropTypes.list.isRequired,
}

export default connect(mapStateToProps)(TrendsHeadlinesPanel)