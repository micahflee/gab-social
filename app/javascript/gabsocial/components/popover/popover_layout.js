import Block from '../block'

export default class PopoverLayout extends PureComponent {
  render() {
    const { children } = this.props

    return (
      <div>
        <Block>
          {children}
        </Block>
      </div>
    )
  }
}