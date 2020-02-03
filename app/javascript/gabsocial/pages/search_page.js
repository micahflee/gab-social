import { Fragment } from 'react';
import Header from '../features/search/components/header';
import LinkFooter from '../components/link_footer';
import { WhoToFollowPanel, SignUpPanel } from '../components/panel';
import PageLayout from '../components/page_layout';

export default class SearchPage extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <PageLayout
        layout={{
          TOP: <Header/>,
          RIGHT: (
            <Fragment>
              <SignUpPanel />
              <WhoToFollowPanel />
            </Fragment>
          ),
          LEFT: <LinkFooter/>,
        }}
      >
        {this.props.children}
      </PageLayout>
    )
  }

};