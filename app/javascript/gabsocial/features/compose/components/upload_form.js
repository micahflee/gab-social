import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import UploadProgress from './upload_progress';
import UploadContainer from '../containers/upload_container';
import SensitiveButtonContainer from '../containers/sensitive_button_container';

const mapStateToProps = state => ({
  mediaIds: state.getIn(['compose', 'media_attachments']).map(item => item.get('id')),
});

export default @connect(mapStateToProps)
class UploadForm extends ImmutablePureComponent {

  static propTypes = {
    mediaIds: ImmutablePropTypes.list.isRequired,
  };

  render () {
    const { mediaIds } = this.props;

    return (
      <div className='compose-form__upload-wrapper'>
        <UploadProgress />

        <div className='compose-form__uploads-wrapper'>
          {mediaIds.map(id => (
            <UploadContainer id={id} key={id} />
          ))}
        </div>

        {!mediaIds.isEmpty() && <SensitiveButtonContainer />}
      </div>
    );
  }

}
