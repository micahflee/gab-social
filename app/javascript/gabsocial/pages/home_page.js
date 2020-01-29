import { Fragment } from 'react';
import GroupSidebarPanel from '../features/groups/sidebar_panel';
import LinkFooter from '../components/link_footer';
import PromoPanel from '../components/promo_panel';
import UserPanel from '../components/user_panel';
import ColumnsArea from '../components/columns_area';
import TimelineComposeBlock from '../components/timeline_compose_block';

export default class HomePage extends PureComponent {
  render () {
    const {children} = this.props;

    return (
      <ColumnsArea
        layout={{
          TOP: null,
          RIGHT: (
            <Fragment>
              <GroupSidebarPanel />
            </Fragment>
          ),
          LEFT: (
            <Fragment>
              <UserPanel />
              <PromoPanel />
              <LinkFooter />
            </Fragment>
          )
        }}
      >
        <TimelineComposeBlock size={46} shouldCondense={true} autoFocus={false} />
        {children}
      </ColumnsArea>
    )
  }
}