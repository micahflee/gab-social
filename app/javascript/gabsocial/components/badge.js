import Text from './text'

export default class Badge extends PureComponent {
  static propTypes = {
    children: PropTypes.string,
    description: PropTypes.string,
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
    const { children, description } = this.props
    const { hovering } = this.state // : todo : tooltip

    return (
      <Text
        color='white'
        size='extraSmall'
        className={[_s.backgroundColorBrand, _s.px5, _s.lineHeight125, _s.radiusSmall].join(' ')}
      >
        {children}
      </Text>
    )
  }
}