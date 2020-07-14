import Block from '../components/block'
import NavigationBar from '../components/navigation_bar'

export default class IntroductionLayout extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
  }

  render() {
    const { children, title } = this.props

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <NavigationBar title={title} noSearch noActions />

        <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
          <div className={[_s.default, _s.width100PC].join(' ')}>
            <main role='main'>
              <div className={[_s.default, _s.alignItemsCenter, _s.py15, _s.px15, _s.mlAuto, _s.mrAuto].join(' ')}>

                <div className={[_s.default, _s.width645PX, _s.maxWidth100PC42PX].join(' ')}>
                  <Block>
                    {children}
                  </Block>
                </div>

              </div>
            </main>
          </div>
        </div>

      </div>
    )
  }

}
