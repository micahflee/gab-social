import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../utils/numbers'
import Text from './text'
import Button from './button'
import Image from './image'
import TrendingItemCard from './trends_panel_item_card'
import DotTextSeperator from './dot_text_seperator'

const cx = classNames.bind(_s)

export default class TrendingItem extends ImmutablePureComponent {

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

    return (
      <NavLink
        to='/test'
        className={[_s.default, _s.noUnderline, _s.px15, _s.py5, _s.borderColorSecondary, _s.borderBottom1PX,  _s.backgroundSubtle_onHover].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <div className={[_s.default, _s.flexRow, _s.mt5].join(' ')}>
          <Text size='small' color='secondary'>1</Text>
          <DotTextSeperator />
          <Text size='small' color='secondary' className={_s.ml5}>Politics</Text>
        </div>
        <div className={[_s.default, _s.py5].join(' ')}>
          <Text color='primary' weight='bold' size='medium'>Trump Campaign</Text>
          <Text color='secondary' className={[_s.mt5, _s.mb10].join(' ')}>46.7K Gabs</Text>
          <TrendingItemCard />
        </div>
      </NavLink>
    )
  }

}
