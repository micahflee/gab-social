import Text from './text'

export default class Badge extends PureComponent {
  static propTypes = {
    children: PropTypes.string,
    popover: PropTypes.string,
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
    const { children, popover } = this.props
    const { hovering } = this.state

    return (
      <div>
        <Text color='secondary' size='small' className={_s.marginVertical5PX}>
          {children}
        </Text>
      </div>
    )
  }
}