import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Responsive from '../features/ui//util/responsive_component'
import Icon from './icon'

export default class PullToRefresher extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
  }

  render() {
    const { children } = this.props

    return (
      <Responsive max={BREAKPOINT_EXTRA_SMALL}>
        <div className={[_s.default, _s.posAbs, _s.left0, _s.right0, _s.topNeg60PX].join(' ')}>
          <Icon id='loading' size='20px' />
        </div>
      </Responsive>
    )
  }

}