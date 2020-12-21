import React from 'react'
import PropTypes from 'prop-types'
import { Sparklines, SparklinesCurve } from 'react-sparklines'
import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import Button from './button'
import Block from './block'
import Text from './text'

class HashtagItem extends ImmutablePureComponent {

  render() {
    const { hashtag, isCompact } = this.props

    if (!hashtag) return

    const count = hashtag.get('history').map((block) => {
      return parseInt(block.get('uses'))
    }).reduce((a, c) => a + c)

    return (
      <Block>
        <div className={[_s.d, _s.w100PC].join(' ')}>
          <div className={[_s.d, _s.noUnderline, _s.px15, _s.py5].join(' ')}>
            <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
              <div>
                <Text color='brand' size='medium' weight='bold' className={[_s.py2, _s.lineHeight15].join(' ')}>
                  #{hashtag.get('name')}
                </Text>
              </div>
            </div>
            {
              !isCompact &&
              <Text color='secondary' size='small' className={_s.py2}>
                <FormattedMessage id='number_of_gabs' defaultMessage='{count} Gabs' values={{
                  count,
                }} />
              </Text>
            }
          </div>

          <Sparklines
            width={50}
            height={28}
            data={hashtag.get('history').reverse().map((day) => day.get('uses')).toArray()}
          >
            <SparklinesCurve style={{ fill: 'none' }} />
          </Sparklines>
        </div>
      </Block>
    )
  }

}

HashtagItem.propTypes = {
  hashtag: ImmutablePropTypes.map.isRequired,
  isCompact: PropTypes.bool,
}

export default HashtagItem