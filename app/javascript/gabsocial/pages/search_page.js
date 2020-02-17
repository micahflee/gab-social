import { Fragment } from 'react';
import Header from '../features/search/components/header';
import LinkFooter from '../components/link_footer';
import { WhoToFollowPanel, SignUpPanel } from '../components/panel';
import DefaultLayout from '../components/layouts/default_layout';

export default class SearchPage extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <DefaultLayout
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
      </DefaultLayout>
    )
  }

};