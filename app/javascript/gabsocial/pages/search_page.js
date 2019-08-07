import { Fragment } from 'react';
import Header from '../features/search/components/header';
import LinkFooter from '../components/link_footer';
import { WhoToFollowPanel, SignUpPanel } from '../components/panel';
import ColumnsArea from '../components/columns_area';

export default class SearchPage extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <ColumnsArea
        layout={{
          top: <Header/>,
          right: (
            <Fragment>
              <SignUpPanel />
              <WhoToFollowPanel />
            </Fragment>
          ),
          left: <LinkFooter/>,
        }}
      >
        {this.props.children}
      </ColumnsArea>
    )
  }

};