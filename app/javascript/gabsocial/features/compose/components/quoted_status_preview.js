import ImmutablePropTypes from 'react-immutable-proptypes';
import DisplayName from '../../../components/display_name';
import StatusContent from '../../../components/status_content';

// : todo : do we need this? make work inside of status/status content

export default class QuotedStatusPreview extends PureComponent {
  static propTypes = {
    status: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
  }

  render() {
    const { status, account } = this.props;

    return (
      <div className='compose-form__quote-preview'>
        <DisplayName account={account} />
        <StatusContent status={status} expanded={false} />
      </div>
    );
  }
}