import './panel.scss';

export default class PanelLayout extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const {title, icon, children} = this.props;

    return (
      <div className='panel'>
        <div className='panel-header'>
          {icon && <Icon id={icon} className='panel-header__icon' />}
          <span className='panel-header__title'>{title}</span>
        </div>
        <div className='panel__content'>
          {children}
        </div>
      </div>
    );
  };

};