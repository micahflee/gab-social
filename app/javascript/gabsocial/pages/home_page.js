import { Fragment } from 'react';
import GroupSidebarPanel from '../features/groups/sidebar_panel';
import LinkFooter from '../components/link_footer';
import PromoPanel from '../components/panel/promo_panel';
import SignUpPanel from '../components/panel/sign_up_panel';
import WhoToFollowPanel from '../components/panel/who_to_follow_panel';
import TrendsPanel from '../components/panel/trends_panel';
import ProgressPanel from '../components/panel/progress_panel';
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
              { /* <SearchInput /> */ }
              { /* <GroupSidebarPanel /> */ }
              <PromoPanel />
              <SignUpPanel />
              { /* <WhoToFollowPanel /> */ }
              { /* <TrendsPanel /> */ }
              <ProgressPanel />
              <LinkFooter />
            </Fragment>
          ),
        }}
      >
        {/*<TimelineComposeBlock size={46} shouldCondense={true} autoFocus={false} />*/}
      { /* children */ }
      </PageLayout>
    )
  }
}