export default class CardView extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
  }

  render() {
    const { children } = this.props

    return (
      <div title='cardview' className={[_s.default].join(' ')}>
        {children}
      </div>
    )
  }

}