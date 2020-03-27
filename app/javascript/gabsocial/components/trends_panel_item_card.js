import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../utils/numbers'
import Text from './text'
import Button from './button'
import Image from './image'

const cx = classNames.bind(_s)

export default class TrendingItemCard extends ImmutablePureComponent {

  static propTypes = {
    trend: ImmutablePropTypes.map.isRequired,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const { trend } = this.props
    const { hovering } = this.state

    const subtitleClasses = cx({
      default: 1,
      text: 1,
      displayFlex: 1,
      fontSize13PX: 1,
      fontWeightNormal: 1,
      colorSecondary: 1,
      underline: hovering,
    })


    // URL with title, description

    // URL with video

    // URL with title, description, image
    return (
      <div className={[_s.default, _s.flexRow, _s.overflowHidden, _s.borderColorSecondary, _s.border1PX, _s.radiusSmall, _s.backgroundSubtle_onHover].join(' ')}>
        <div className={[_s.default, _s.flexNormal, _s.py10, _s.px10].join(' ')}>
          <Text color='secondary'  className={_s.lineHeight15}>
            NYPost
          </Text>
          <Text size='medium' color='primary'>
            The best flower subscription services: BloomsyBox, Bouqs...
          </Text>
        </div>
        <Image width='92px' height='96px' />
      </div>
    )
  }

}
