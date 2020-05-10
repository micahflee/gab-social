import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { shortNumberFormat } from '../../../utils/numbers';
import { connect } from 'react-redux';

const messages = defineMessages({
    new_statuses: { id: 'groups.sidebar-panel.item.view', defaultMessage: 'new gabs' },
    no_recent_activity: { id: 'groups.sidebar-panel.item.no_recent_activity', defaultMessage: 'No recent activity' },
});

const mapStateToProps = (state, { id }) => ({
	group: state.getIn(['groups', id]),
	relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
@injectIntl
class Item extends ImmutablePureComponent {
    static propTypes = {
        group: ImmutablePropTypes.map,
        relationships: ImmutablePropTypes.map,
    }

    render() {
        const { intl, group, relationships } = this.props;

        // Wait for relationships
        if (!relationships) return null;

        return (
            <Link to={`/groups/${group.get('id')}`} className="group-sidebar-panel__item">
                <div className="group-sidebar-panel__item__title">{group.get('title')}</div>
            </Link>
        );
    }
}