import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { urlRegex } from '../features/ui/util/url_regex'
import { DEFAULT_REL } from '../constants'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'

class TrendsItem extends ImmutablePureComponent {

  render() {
    const { trend } = this.props

    if (!trend) return null

    const title = trend.get('title')
    const url = trend.get('trends_url')

    if (!title || !url) return null
    
    let correctedDescription = trend.get('description')
    correctedDescription = correctedDescription.length >= 120 ? `${correctedDescription.substring(0, 120).trim()}...` : correctedDescription
    const descriptionHasLink = correctedDescription.match(urlRegex)

    return (
      <Button
        noClasses
        href={url}
        target='_blank'
        rel={DEFAULT_REL}
        className={[_s.d, _s.noUnderline, _s.px15, _s.pt10, _s.pb5, _s.borderBottom1PX, _s.borderColorSecondary, _s.bgSubtle_onHover].join(' ')}
      >
        <div className={[_s.d, _s.flexNormal, _s.pb5].join(' ')}>
          <div className={_s.d}>
            <Text size='medium' color='primary' weight='bold'>
              {title}
            </Text>
          </div>

          {
            !!correctedDescription && !descriptionHasLink &&
            <div className={[_s.d, _s.maxH56PX, _s.overflowHidden, _s.pt5, _s.mb5].join(' ')}>
              <Text size='small' color='secondary'>
                {correctedDescription}
              </Text>
            </div>
          }

          <div className={[_s.d, _s.flexRow].join(' ')}>
            <Text color='secondary' size='small'>
              {trend.get('feed_base_url')}
            </Text>
            <DotTextSeperator />
            <Text color='secondary' size='small' className={_s.ml5}>
              trends.gab.com
            </Text>
            <DotTextSeperator />
            <Text color='secondary' size='small' className={_s.ml5}>
              <RelativeTimestamp timestamp={trend.get('publish_date')} />
            </Text>
          </div>
        </div>
      </Button>
    )
  }

}

TrendsItem.propTypes = {
  trend: ImmutablePropTypes.map,
}

export default TrendsItem