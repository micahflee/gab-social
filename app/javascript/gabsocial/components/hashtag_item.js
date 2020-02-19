import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { shortNumberFormat } from '../utils/numbers'
import Text from './text'

export default class HashtagItem extends ImmutablePureComponent {

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

    return (
      <NavLink
        to='/test'
        className={[_s.default, _s.noUnderline, _s.backgroundSubtle_onHover, _s.paddingHorizontal15PX, _s.paddingVertical5PX].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <Text color='brand' size='medium' weight='bold' className={_s.paddingVertical2PX}>
          #randomhashtag
        </Text>
        <Text color='secondary' size='small' underline={hovering} className={_s.paddingVertical2PX}>
          10,240 Gabs
        </Text>
      </NavLink>
    )
  }

}
