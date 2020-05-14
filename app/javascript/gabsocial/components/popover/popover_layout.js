import Block from '../block'
import Heading from '../heading'

export default class PopoverLayout extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    width: PropTypes.number,
    isXS: PropTypes.bool,
    title: PropTypes.string,
  }

  static defaultProps = {
    width: 250,
  }

  render() {
    const {
      children,
      width,
      isXS,
      title,
    } = this.props

    if (isXS) {
      return (
        <div className={[_s.default, _s.bgPrimary, _s.modal, _s.topRightRadiusSmall, _s.topLeftRadiusSmall].join(' ')}>
          {
            !!title &&
            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
              <Heading size='h2'>
                {title}
              </Heading>
            </div>
          }
          <div className={[_s.default, _s.heightMax80VH, _s.topRightRadiusSmall, _s.topLeftRadiusSmall, _s.overflowYScroll].join(' ')}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div style={{ width: `${width}px` }} className={_s.modal}>
        <Block>
          {children}
        </Block>
      </div>
    )
  }

}