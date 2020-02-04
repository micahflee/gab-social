import { Fragment } from 'react';
// import GroupSidebarPanel from '../features/groups/sidebar_panel';
import LinkFooter from '../components/link_footer';
// import PromoPanel from '../components/promo_panel';
// import UserPanel from '../components/user_panel';
import PageLayout from '../components/page_layout';
// import TimelineComposeBlock from '../components/timeline_compose_block';

export default class HomePage extends PureComponent {
  render () {
    const {children} = this.props;

    return (
      <PageLayout
        layout={{
          RIGHT: (
            <Fragment>
              {/*<GroupSidebarPanel />*/}
              {/*<PromoPanel />*/}
              <LinkFooter />
            </Fragment>
          ),
        }}
      >
        {/*<TimelineComposeBlock size={46} shouldCondense={true} autoFocus={false} />*/}
      {/*children*/}
      </PageLayout>
    )
  }
}