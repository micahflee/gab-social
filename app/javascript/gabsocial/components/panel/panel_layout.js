import Heading from '../heading'
import Button from '../button'

export default class PanelLayout extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    buttonTitle: PropTypes.string,
    buttonAction: PropTypes.func,
    buttonTo: PropTypes.func,
    noPadding: PropTypes.bool,
  }

  render() {
    const { title, subtitle, buttonTitle, buttonAction, buttonTo, noPadding, children } = this.props

    return (
      <aside className={[_s.default, _s.backgroundWhite, _s.overflowHidden, _s.radiusSmall, _s.marginBottom15PX, _s.bordercolorSecondary, _s.border1PX].join(' ')}>
        {
          (title || subtitle) &&
          <div className={[_s.default, _s.paddingHorizontal15PX, _s.paddingVertical10PX, _s.bordercolorSecondary, _s.borderBottom1PX].join(' ')}>
            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Heading size='h3'>
                {title}
              </Heading>
              {
                (!!buttonTitle && (!!buttonAction || !!buttonTo)) &&
                <div className={[_s.default, _s.marginLeftAuto].join(' ')}>
                  <Button
                    text
                    to={buttonTo}
                    onClick={buttonAction}
                    className={[_s.default, _s.cursorPointer, _s.fontWeightBold, _s.text, _s.colorBrand, _s.fontSize13PX, _s.noUnderline].join(' ')}
                  >
                    {buttonTitle}
                  </Button>
                </div>
              }
            </div>
            {
              subtitle &&
              <Heading size='h4'>
                {subtitle}
              </Heading>
            }
          </div>
        }

        {
          !noPadding &&
          <div className={[_s.default, _s.paddingHorizontal15PX, _s.paddingVertical10PX].join(' ')}>
            {children}
          </div>
        }

        {
          noPadding && children
        }
      </aside>
    )
  }
}