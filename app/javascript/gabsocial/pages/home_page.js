import { Fragment } from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import WhoToFollowPanel from '../components/panel';
import LinkFooter from '../components/link_footer';
import PromoPanel from '../components/promo_panel';
import UserPanel from '../components/user_panel';
import ComposeFormContainer from '../features/compose/containers/compose_form_container';
import Avatar from '../components/avatar';
import GroupSidebarPanel from '../features/groups/sidebar_panel';
import { me } from '../initial_state';
import ColumnsArea from '../components/columns_area';

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
});

export default @connect(mapStateToProps)
class HomePage extends ImmutablePureComponent {
  render () {
    const {children, account} = this.props;

    return (
      <ColumnsArea
        layout={{
          top: null,
          right: (
            <Fragment>
              <GroupSidebarPanel />
              {/*<WhoToFollowPanel />*/}
            </Fragment>
          ),
          left: (
            <Fragment>
              <UserPanel />
              <PromoPanel />
              <LinkFooter />
            </Fragment>
          )
        }}
      >
        <div className='timeline-compose-block'>
          <div className='timeline-compose-block__avatar'>
            <Avatar account={account} size={46} />
          </div>
          <ComposeFormContainer shouldCondense={true} autoFocus={false} />
        </div>

        {children}
      </ColumnsArea>
    )
  }
}