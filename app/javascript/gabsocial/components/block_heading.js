import Heading from './heading'

export default class BlockHeading extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  render() {
    const { title } = this.props

    return (
      <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
          <Heading size='h2'>{title}</Heading>
        </div>
      </div>
    )
  }

}