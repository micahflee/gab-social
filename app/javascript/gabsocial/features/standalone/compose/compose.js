import ComposeFormContainer from '../../compose/containers/compose_form_container';
import NotificationsContainer from '../../../containers/notifications_container';
import LoadingBarContainer from '../../../containers/loading_bar_container';
import ModalRoot from '../../../components/modal/modal_root'

export default class Compose extends PureComponent {

  render() {
    return (
      <div>
        <ComposeFormContainer />
        <NotificationsContainer />
        <ModalRoot />
        <LoadingBarContainer className='loading-bar' />
      </div>
    );
  }

}
