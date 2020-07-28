import { CX } from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'

export default class AccountPlaceholder extends PureComponent {
  
  static propTypes = {
    isLast: PropTypes.bool,
  }

  render() {
    const { isLast } = this.props

    const classes = CX({
      default: 1,
      px15: 1,
      py7: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const width = getRandomInt(120, 300)

    return (
      <div className={classes}>
        <PlaceholderLayout viewBox='0 0 400 60'>
          <circle cx='27' cy='28' r='27' />
          <rect x='72' y='10' rx='5' ry='5' width={width} height='14' /> 
          <rect x='72' y='36' rx='5' ry='5' width='108' height='14' /> 
        </PlaceholderLayout>
      </div>
    )
  }

}