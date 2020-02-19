import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../utils/numbers'

const cx = classNames.bind(_s)

export default class TrendingItem extends ImmutablePureComponent {

  static propTypes = {
    trend: ImmutablePropTypes.map.isRequired,
  };

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
        className={[_s.default, _s.noUnderline, _s.marginBottom10PX].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <span className={[_s.default, _s.text, _s.displayFlex, _s.colorBrand, _s.fontSize15PX, _s.fontWeightBold, _s.lineHeight15].join(' ')}>#randomhashtag</span>
        <span className={subtitleClasses}>10,240 Gabs</span>
      </NavLink>
    )
  }

}
