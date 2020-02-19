import Text from './text'

export default class SidebarSectionTitle extends PureComponent {

  static propTypes = {
    children: PropTypes.string.isRequired,
  }

  render() {
    const { children } = this.props

    return (
      <div className={[_s.default, _s.paddingVertical5PX, _s.paddingHorizontal10PX, _s.marginTop10PX].join(' ')}>
        <Text size='small' weight='bold' color='secondary'>
          {children}
        </Text>
      </div>
    )
  }

}
