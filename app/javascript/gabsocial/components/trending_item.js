import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../utils/numbers'

export default class TrendingItem extends ImmutablePureComponent {

  static propTypes = {
    hashtag: ImmutablePropTypes.map.isRequired,
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
    const { hashtag } = this.props
    const { hovering } = this.state

    const cx = classNames.bind(styles)
    const subtitleClasses = cx({
      default: 1,
      text: 1,
      displayFlex: 1,
      fontSize13PX: 1,
      fontWeightNormal: 1,
      colorSubtle: 1,
      underline: hovering,
    })

    return (
      <NavLink
        to='/test'
        className={[styles.default, styles.noUnderline, styles.marginBottom10PX].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <span className={[styles.default, styles.text, styles.displayFlex, styles.colorBrand, styles.fontSize15PX, styles.fontWeightBold, styles.lineHeight15].join(' ')}>#randomhashtag</span>
        <span className={subtitleClasses}>10,240 Gabs</span>
      </NavLink>
    )
  }

}
