import ComposeFormContainer from '../../compose/containers/compose_form_container';
import NotificationsContainer from '../../../containers/notifications_container';
import LoadingBarContainer from '../../../containers/loading_bar_container';
import ModalContainer from '../../../containers/modal_container';

export default class Compose extends PureComponent {

  render () {
    return (
      <div>
        <ComposeFormContainer />
        <NotificationsContainer />
        <ModalContainer />
        <LoadingBarContainer className='loading-bar' />
      </div>
    );
  }

}
