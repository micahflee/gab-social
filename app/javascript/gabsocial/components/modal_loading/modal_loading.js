import ColumnIndicator from '../column_indicator';

// Keep the markup in sync with <BundleModalError />
// (make sure they have the same dimensions)
export default class ModalLoading extends PureComponent {
  render() {
    return (
      <div className='modal-root__modal error-modal'>
        <div className='error-modal__body'>
          <ColumnIndicator type='loading' />
        </div>
        <div className='error-modal__footer'>
          <div>
            <button className='error-modal__nav onboarding-modal__skip' />
          </div>
        </div>
      </div>
    );
  }
}