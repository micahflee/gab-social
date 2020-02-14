import { length } from 'stringz'

export default class CharacterCounter extends PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
  }

  render () {
    const radius = 12
    const circumference = 2 * Math.PI * radius
    const diff = length(this.props.text) / this.props.max
    const dashoffset = circumference * (1 - diff)

    return (
      <div className={[styles.default, styles.marginRight10PX, styles.justifyContentCenter, styles.alignItemsCenter].join(' ')}>
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle fill='none' cx="16" cy="16" r="12" fill="none" stroke="#e6e6e6" stroke-width="2" />
          <circle style={{
              // transform: 'rotate(-90deg)',
              strokeDashoffset: dashoffset,
              strokeDasharray: circumference,
            }}
            fill='none'
            cx="16"
            cy="16"
            r="12"
            strokeWidth="2"
            strokeLinecap='round'
            stroke='#21cf7a'
          />
        </svg>
      </div>
    )
  }

}
