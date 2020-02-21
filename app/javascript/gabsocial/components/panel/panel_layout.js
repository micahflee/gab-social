import Heading from '../heading'
import Button from '../button'
import Text from '../text'

export default class PanelLayout extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    headerButtonTitle: PropTypes.string,
    headerButtonAction: PropTypes.func,
    headerButtonTo: PropTypes.func,
    footerButtonTitle: PropTypes.string,
    footerButtonAction: PropTypes.func,
    footerButtonTo: PropTypes.func,
    noPadding: PropTypes.bool,
  }

  render() {
    const {
      title,
      subtitle,
      headerButtonTitle,
      headerButtonAction,
      headerButtonTo,
      footerButtonTitle,
      footerButtonAction,
      footerButtonTo,
      noPadding,
      children,
    } = this.props

    return (
      <aside className={[_s.default, _s.backgroundColorPrimary, _s.overflowHidden, _s.radiusSmall, _s.marginBottom15PX, _s.borderColorSecondary, _s.border1PX].join(' ')}>
        {
          (title || subtitle) &&
          <div className={[_s.default, _s.paddingHorizontal15PX, _s.paddingVertical10PX, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')}>
            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Heading size='h3'>
                {title}
              </Heading>
              {
                (!!headerButtonTitle && (!!headerButtonAction || !!headerButtonTo)) &&
                <div className={[_s.default, _s.marginLeftAuto].join(' ')}>
                  <Button
                    text
                    backgroundColor='none'
                    color='brand'
                    to={headerButtonTo}
                    onClick={headerButtonAction}
                  >
                    <Text size='small' color='inherit' weight='bold'>
                      {headerButtonTitle}
                    </Text>
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

        {
          (!!footerButtonTitle && (!!footerButtonAction || !!footerButtonTo)) &&
          <div className={[_s.default, _s.borderColorSecondary, _s.borderTop1PX].join(' ')}>
          <Button
            text
            color='none'
            backgroundColor='none'
            to={footerButtonTo}
            onClick={footerButtonAction}
            className={[_s.paddingHorizontal15PX, _s.paddingVertical15PX, _s.backgroundSubtle_onHover].join(' ')}
          >
            <Text color='brand' align='left' size='medium'>
              {footerButtonTitle}
            </Text>
          </Button>
          </div>
        }
      </aside>
    )
  }
}