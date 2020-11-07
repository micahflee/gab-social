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
    const trendsLeadlineTitle = trendsLeadline.get('title')
    const trendsLeadlineImage = trendsLeadline.get('image')
    const trendsLeadlineUrl = trendsLeadline.get('trends_url')

    if ((count === 0 && isFetched) && (!trendsLeadlineTitle || !trendsLeadlineTitle || !trendsLeadlineTitle)) return null

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
        subtitle='Headlines about yadda'
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
        <Button
          noClasses
          href={''}
          className={leadlineButtonClasses}
        >
          <Image
            src='https://trends.gab.com/image/5fa5d8badf30e602384b08ed'
          />
          <Text className={[_s.px15, _s.py15, _s.w100PC, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
            Lawsuit: At Least 21K Dead People on Pennsylvania Voter Rolls
          </Text>
        </Button>
      </PanelLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['news', 'trends_headlines', 'isLoading']),
  isFetched: state.getIn(['news', 'trends_headlines', 'isFetched']),
  items: state.getIn(['news', 'trends_headlines', 'items']),
  trendsLeadline: state.getIn(['news', 'trends_leadline']),
})

TrendsHeadlinesPanel.propTypes = {
  isLoading: PropTypes.bool,
  isFetched: PropTypes.bool,
  items: ImmutablePropTypes.list.isRequired,
}

export default connect(mapStateToProps)(TrendsHeadlinesPanel)