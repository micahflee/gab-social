import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DEFAULT_REL } from '../constants'
import Button from './button'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'
import Image from './image'

class NewsItem extends ImmutablePureComponent {

  render() {
    const { news } = this.props

    if (!news) return null

    const title = news.get('title')
    const url = news.get('url')

    if (!title || !url) return null
    
    return (
      <Button
        noClasses
        href={url}
        target='_blank'
        rel={DEFAULT_REL}
        className={[_s.d, _s.bgPrimary, _s.radiusSmall, _s.mr15, _s.overflowHidden, _s.h260PX, _s.w330PX].join(' ')}
      >
        <Image
          src={news.get('image')}
          className={[_s.h100PC, _s.w100PC, _s.left0, _s.top0, _s.right0, _s.bottom0, _s.posAbs, _s.z1].join(' ')}
        />
        <div className={[_s.d, _s.newsBackground, _s.h100PC, _s.w100PC, _s.top0, _s.left0, _s.right0, _s.bottom0, _s.posAbs, _s.z2].join(' ')}>
          <div className={[_s.d, _s.w100PC, _s.px15, _s.pb15, _s.left0, _s.right0, _s.bottom0, _s.posAbs, _s.z2].join(' ')}>
            <Text color='white' size='large' weight='medium'>
              {title}
            </Text>
            <div className={[_s.d, _s.flexRow, _s.mt5].join(' ')}>
              <Text color='white' size='small' className={_s.mr5}>
                <RelativeTimestamp timestamp={news.get('publish_date')} />
              </Text>
              <Text color='white' size='small'>
                · Click to read
              </Text>
            </div>
          </div>
        </div>
      </Button>
    )
  }

}

NewsItem.propTypes = {
  news: ImmutablePropTypes.map,
}

export default NewsItem