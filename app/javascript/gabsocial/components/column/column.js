import ColumnHeader from '../column_header';
import { isMobile } from '../../utils/is_mobile';
import ColumnBackButton from '../column_back_button';

import './column.scss';

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
    // const header = showHeading && (
    //   <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />
    // );

    return (
      <div role='region' aria-labelledby={columnHeaderId} className='column'>
        { backBtn && <ColumnBackButton slim={backBtn === 'slim'} />}
        {children}
      </div>
    );
  }

}
