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

        <NavigationBar title={title} />

        <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
          <div className={[_s.default, _s.width100PC].join(' ')}>
            <main role='main'>
              <div className={[_s.default, _s.mlAuto, _s.mrAuto].join(' ')}>
                {children}
              </div>
            </main>
          </div>
        </div>

      </div>
    )
  }

}
