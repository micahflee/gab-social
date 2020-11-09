import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { openModal } from '../actions/modal'
import { changeCompose } from '../actions/compose'
import { urlRegex } from '../features/ui/util/url_regex'
import {
  CX,
  DEFAULT_REL,
  MODAL_COMPOSE,
} from '../constants'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'
import Image from './image'

class TrendsCard extends ImmutablePureComponent {

  handleOnShare = () => {
    this.props.onOpenComposeModal(this.props.trend.get('trends_url'))
  }

  render() {
    const {
      trend,
      viewType,
      isXS,
    } = this.props

    if (!trend) return null

    const title = trend.get('title')
    const url = trend.get('trends_url')

    if (!title || !url) return null
    
    let correctedDescription = trend.get('description')
    correctedDescription = correctedDescription.length >= 120 ? `${correctedDescription.substring(0, 120).trim()}...` : correctedDescription
    const descriptionHasLink = correctedDescription.match(urlRegex)


    const containerClasses = CX({
      d: 1,
      w100PC: isXS || viewType === 0,
      pb10: viewType === 0,
      w33PC: !isXS && viewType === 1,
      px10: viewType === 1,
      py10: viewType === 1,
      mb5: isXS,
    })

    const innerContainerClasses = CX({
      d: 1,
      flexRow: !isXS && viewType === 0,
      boxShadowBlock: 1,
      w100PC: 1,
      h100PC: 1,
      radiusSmall: !isXS,
      overflowHidden: 1,
      bgPrimary: 1,
    })

    const textContainerClasses = CX({
      d: 1,
      flexNormal: 1,
      w100PC: viewType === 1,
    })

    let imgWidth, imgHeight = viewType === 1 ? '100%' : '320px'
    if (viewType === 1) {
      imgWidth = '100%'
      imgHeight = '172px'
    } else {
      imgWidth = '358px'
      imgHeight = '232px'
    }
    if (isXS) {
      imgWidth = '100%'
      imgHeight = '172px'
    }

    return (
      <div className={containerClasses}>
        <div className={innerContainerClasses}>
          <Image
            height={imgHeight}
            width={imgWidth}
            src={trend.get('image')}
            nullable
          />
          <div className={textContainerClasses}>
            <div className={[_s.d, _s.w100PC, _s.pt15, _s.px15].join(' ')}>
              <Button
                noClasses
                rel={DEFAULT_REL}
                href={trend.get('trends_url')}
                className={[_s.noUnderline].join(' ')}
              >
                <Text size='large' weight='medium' color='primary'>
                  {title}
                </Text>
              </Button>
              {
                !!correctedDescription && !descriptionHasLink &&
                <Text color='secondary' className={_s.pt7}>
                  {correctedDescription}
                </Text>
              }
              <div className={[_s.d, _s.flexRow, _s.pt7].join(' ')}>
                <Text color='secondary' size='small'>
                  {trend.get('feed_base_url')}
                </Text>
                <DotTextSeperator />
                <Text color='secondary' size='small' className={_s.ml5}>
                  <RelativeTimestamp timestamp={trend.get('publish_date')} />
                </Text>
              </div>
            </div>
            <div className={[_s.d, _s.flexRow, _s.w100PC, _s.mtAuto, _s.py15, _s.px15].join(' ')}>
              <Button
                isNarrow
                color='secondary'
                backgroundColor='tertiary'
                onClick={this.handleOnShare}
                className={[_s.px15].join(' ')}
              >
                <Text color='inherit' size='extraSmall'>Share on Gab</Text>
              </Button>
              <Button
                isNarrow
                color='tertiary'
                backgroundColor='none'
                rel={DEFAULT_REL}
                href={trend.get('trends_url')}
                className={[_s.px0, _s.mlAuto].join(' ')}
              >
                <Text color='inherit' size='extraSmall'>Go to Story</Text>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  onOpenComposeModal(trendsUrl) {
    dispatch(openModal(MODAL_COMPOSE))
    dispatch(changeCompose(`${trendsUrl} `)) //extra space at the end
  },
})

TrendsCard.propTypes = {
  trend: ImmutablePropTypes.map,
  viewType: PropTypes.string,
  isXS: PropTypes.bool,
  onOpenComposeModal: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(TrendsCard)