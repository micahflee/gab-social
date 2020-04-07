import Block from '../block'

export default class PopoverLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    width: PropTypes.number,
  }

  static defaultProps = {
    width: 250,
  }

  render() {
    const { children, className, width } = this.props

    return (
      <div className={className} style={{width: `${width}px`}}>
        <Block>
          {children}
        </Block>
      </div>
    )
  }
}