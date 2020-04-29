import PillItem from './pill_item'

/**
 * Renders pills components
 * @param {array} [props.pills] - tab bar data for creating `TabBarItem`
 */
export default class Pills extends PureComponent {

  static propTypes = {
    pills: PropTypes.array,
  }

  render() {
    const { pills } = this.props

    return (
      <div className={[_s.default, _s.flexWrap, _s.px5, _s.flexRow].join(' ')}>
        {
          !!pills &&
          pills.map((tab, i) => (
            <PillItem
              key={`pill-item-${i}`}
              title={tab.title}
              onClick={tab.onClick}
              to={tab.to}
              isActive={tab.active}
            />
          ))
        }
      </div>
    )
  }

}