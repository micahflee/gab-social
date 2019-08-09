import { FormattedMessage } from 'react-intl';
import spring from 'react-motion/lib/spring';
import Motion from '../../../ui/util/optional_motion';
import Icon from '../../../../components/icon';

import './upload_progress.scss'

const mapStateToProps = state => ({
  active: state.getIn(['compose', 'is_uploading']),
  progress: state.getIn(['compose', 'progress']),
});

export default @connect(mapStateToProps)
class UploadProgress extends PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    progress: PropTypes.number,
  };

  render () {
    const { active, progress } = this.props;

    if (!active) {
      return null;
    }

    return (
      <div className='upload-progress'>
        <div className='upload-progress__icon'>
          <Icon id='upload' />
        </div>

        <div className='upload-progress__message'>
          <FormattedMessage id='upload_progress.label' defaultMessage='Uploading...' />

          <div className='upload-progress__backdrop'>
            <Motion defaultStyle={{ width: 0 }} style={{ width: spring(progress) }}>
              {({ width }) =>
                <div className='upload-progress__tracker' style={{ width: `${width}%` }} />
              }
            </Motion>
          </div>
        </div>
      </div>
    );
  }

}
