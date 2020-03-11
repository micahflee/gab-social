import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { shortNumberFormat } from '../utils/numbers'
import Text from './text'
import Button from './button'

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
        to='/tags/test'
        className={[_s.default, _s.noUnderline, _s.backgroundSubtle_onHover, _s.px15, _s.py5].join(' ')}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
          <div>
            <Text color='brand' size='medium' weight='bold' className={[_s.py2, _s.lineHeight15].join(' ')}>
              #randomhashtag
            </Text>
          </div>
          <Button
            text
            backgroundColor='none'
            color='none'
            icon='caret-down'
            iconWidth='8px'
            iconHeight='8px'
            iconClassName={_s.fillColorSecondary}
            className={_s.marginLeftAuto}
          />
        </div>
        <Text color='secondary' size='small' className={_s.py2}>
          10,240 Gabs
        </Text>
      </NavLink>
    )
  }

}
