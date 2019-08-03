import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { shortNumberFormat } from '../../utils/numbers';

import './index.scss';

export default class TimelineQueueButtonHeader extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    itemType: PropTypes.string,
  };

  static defaultProps = {
    count: 0,
    itemType: 'item',
  };

  render () {
    const { count, itemType, onClick } = this.props;

    const hasItems = (count > 0);

    const classes = classNames('timeline-queue-header', {
      'timeline-queue-header--extended': hasItems,
    });

    return (
      <div className={classes}>
        <a className='timeline-queue-header__btn' onClick={onClick}>
          {
            hasItems &&
            <FormattedMessage
              id='timeline_queue.label'
              defaultMessage='{count} new {type}'
              values={{
                count: shortNumberFormat(count),
                type: count === 1 ? itemType : `${itemType}s`,
              }}
            />
          }
        </a>
      </div>
    );
  }

}