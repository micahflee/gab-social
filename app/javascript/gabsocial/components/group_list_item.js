import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { shortNumberFormat } from '../utils/numbers';

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
});

export default
@injectIntl
class GroupListItem extends ImmutablePureComponent {
  static propTypes = {
    group: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { intl, group } = this.props;

    if (!group) return null;

    return (
      <div className='trends__item'>
        <div className='trends__item__name'>
          <Link to={`/groups/${group.get('id')}`}>
            <strong>{group.get('title')}</strong>
            <br />
            <span>
              {shortNumberFormat(group.get('member_count'))}
              &nbsp;
              {intl.formatMessage(messages.members)}
            </span>
          </Link>
        </div>
      </div>
    );
  }
}