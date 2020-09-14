import React from 'react'
import PropTypes from 'prop-types'
import { DEFAULT_REL } from '../constants'
import Image from './image'
import Text from './text'

class ShopItem extends React.PureComponent {

  render() {
    const {
      image,
      link,
      name,
      price,
    } = this.props

    return (
      <a
        className={[_s.d, _s.w50PC, _s.maxW212PX, _s.noUnderline, _s.overflowHidden, _s.cursorPointer, _s.pb15, _s.pr5].join(' ')}
        target='_blank'
        rel={DEFAULT_REL}
        href={link}
        title={name}
      >
        <Image
          src={image}
          className={[_s.w100PC, _s.h122PX].join(' ')}
        />

        <Text
          align='center'
          className={[_s.pt10, _s.px10].join(' ')}
        >
          {name}
        </Text>

        {
          !!price &&
          <Text
            size='small'
            align='center'
            color='tertiary'
            className={[_s.pt5, _s.px10].join(' ')}
          >
            {price}
          </Text>
        }
      </a>
    )
  }

}

ShopItem.propTypes = {
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string,
}

export default ShopItem