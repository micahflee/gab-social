import Block from '../block'
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
      <aside className={[_s.default, _s.mb15].join(' ')}>
        <Block>
          {
            (title || subtitle) &&
            <div className={[_s.default, _s.px15, _s.py10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')}>
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
            <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
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
                className={[_s.px15, _s.py15, _s.backgroundSubtle_onHover].join(' ')}
              >
                <Text color='brand' align='left' size='medium'>
                  {footerButtonTitle}
                </Text>
              </Button>
            </div>
          }
        </Block>
      </aside>
    )
  }
}