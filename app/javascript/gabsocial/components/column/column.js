import { isMobile } from '../../utils/is_mobile';

export default class Column extends PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    hideHeadingOnMobile: PropTypes.bool,
    backBtn: PropTypes.oneOf([
      'normal',
      'slim',
    ]),
  };

  render () {
    const { heading, icon, children, active, hideHeadingOnMobile, backBtn } = this.props;

    const showHeading = heading && (!hideHeadingOnMobile || (hideHeadingOnMobile && !isMobile(window.innerWidth)));
    const columnHeaderId = showHeading && heading.replace(/ /g, '-');

    return (
      <div role='region' aria-labelledby={columnHeaderId} className={[_s.default].join(' ')}>
        {children}
      </div>
    );
  }

}
