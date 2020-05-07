import { withRouter } from 'react-router-dom'
import { me } from '../initial_state'
import Button from './button'

export default
@withRouter
class FooterBar extends PureComponent {

  render() {
    if (!me) return false

    return (
      <div className={[_s.default, _s.z4, _s.heightMin58PX, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.posFixed, _s.left0, _s.right0, _s.bottom0, _s.heightMin58PX, _s.width100PC, _s.bgPrimary, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.height100PC, _s.heightMin58PX, _s.footerChin, _s.justifyContentSpaceAround].join(' ')}>
            <Button
              backgroundColor='none'
              color='secondary'
              to='/home'
              icon='home'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              to='/notifications'
              icon='notifications'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              href='https://chat.gab.com'
              icon='chat'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              href='https://trends.gab.com'
              icon='trends'
              iconSize='20px'
            />
            <Button
              backgroundColor='none'
              color='secondary'
              to='/groups'
              icon='group'
              iconSize='20px'
            />
          </div>
        </div>
      </div>
    )
  }
}
