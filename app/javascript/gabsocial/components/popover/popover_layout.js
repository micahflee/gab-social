import Block from '../block'

export default class PopoverLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  }

  render() {
    const { children, className } = this.props

    return (
      <div className={className}>
        <Block>
          {children}
        </Block>
      </div>
    )
  }
}