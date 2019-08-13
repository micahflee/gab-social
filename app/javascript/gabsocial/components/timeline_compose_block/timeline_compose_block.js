import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Avatar from '../avatar';
import ComposeFormContainer from '../../features/compose/containers/compose_form_container';
import { me } from '../../initial_state';

import './timeline_compose_block.scss';

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
  };
};

export default @connect(mapStateToProps)
class TimelineComposeBlock extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 32,
  }

  render() {
    const { account, size, ...rest } = this.props;

    return (
      <div className='timeline-compose-block'>
        <div className='timeline-compose-block__avatar'>
          <Avatar account={account} size={size} />
        </div>
        <ComposeFormContainer {...rest} />
      </div>
    )
  }

}