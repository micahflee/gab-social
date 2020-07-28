import { CX } from '../../constants'
import { getRandomInt } from '../../utils/numbers'
import PlaceholderLayout from './placeholder_layout'

export default class ListItemPlaceholder extends PureComponent {
  
  static propTypes = {
    isLast: PropTypes.bool,
  }

  render() {
    const { isLast } = this.props

    const classes = CX({
      default: 1,
      px15: 1,
      py15: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const width = getRandomInt(120, 375)

    return (
      <div className={classes}>
        <PlaceholderLayout viewBox='0 0 400 30'>
          <circle cx='10' cy='17' r='10' /> 
          <rect x='30' y='12' rx='5' ry='5' width={width} height='12' />
        </PlaceholderLayout>
      </div>
    )
  }

}