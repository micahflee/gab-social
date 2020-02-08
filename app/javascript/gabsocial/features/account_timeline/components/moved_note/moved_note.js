import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { NavLink } from 'react-router-dom';
import AvatarOverlay from '../../../../components/avatar_overlay';
import DisplayName from '../../../../components/display_name';
import Icon from '../../../../components/icon';

export default class MovedNote extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    from: ImmutablePropTypes.map.isRequired,
    to: ImmutablePropTypes.map.isRequired,
  };

  render () {
    const { from, to } = this.props;
    const displayNameHtml = { __html: from.get('display_name_html') };

    return (
      <div className='moved-note'>
        <div className='moved-note__message'>
          <div className='moved-note__icon-wrapper'>
            <Icon id='suitcase' className='moved-note__icon' fixedWidth />
          </div>
          <FormattedMessage
            id='account.moved_to'
            defaultMessage='{name} has moved to:'
            values={{
              name: <bdi><strong dangerouslySetInnerHTML={displayNameHtml} /></bdi>
            }}
          />
        </div>

        <NavLink to={`/${this.props.to.get('acct')}`} className='moved-note__display-name'>
          <div className='moved-note__display-avatar'>
            <AvatarOverlay account={to} friend={from} />
          </div>
          <DisplayName account={to} />
        </NavLink>
      </div>
    );
  }

}
