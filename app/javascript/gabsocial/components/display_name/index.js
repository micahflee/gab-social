import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import VerifiedIcon from '../verified_icon';

import './index.scss';

export default class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  };

  render () {
    const { account } = this.props;

    return (
      <span className='display-name'>
        <bdi>
          <strong className='display-name__html' dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }} />
        </bdi>
        {account.get('is_verified') && <VerifiedIcon />}
        <span className='display-name__account'>@{account.get('acct')}</span>
      </span>
    );
  }

}
