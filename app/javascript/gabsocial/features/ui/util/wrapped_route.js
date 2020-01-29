import { Route } from 'react-router-dom';
import ColumnsArea from '../../../components/columns_area';
import BundleColumnError from '../../../components/bundle_column_error';
import Bundle from './bundle';
import { me } from '../../../initial_state';
import ColumnIndicator from '../../../components/column_indicator';

export default class WrappedRoute extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    page: PropTypes.func,
    content: PropTypes.node,
    componentParams: PropTypes.object,
    layout: PropTypes.object,
    publicRoute: PropTypes.bool,
  };

  static defaultProps = {
    componentParams: {},
  };

  renderComponent = ({ match }) => {
    const { component, content, componentParams, layout, page: Page } = this.props;

    if (Page) {
      return (
        <Bundle fetchComponent={component} loading={this.renderLoading} error={this.renderError}>
          {Component =>
            (
              <Page params={match.params} {...componentParams}>
                <Component params={match.params} {...componentParams}>
                  {content}
                </Component>
              </Page>
            )
          }
        </Bundle>
      );
    }

    return (
      <Bundle fetchComponent={component} loading={this.renderLoading} error={this.renderError}>
        {Component =>
          (
            <ColumnsArea layout={layout}>
              <Component params={match.params} {...componentParams}>
                {content}
              </Component>
            </ColumnsArea>
          )
        }
      </Bundle>
    );
  }

  renderLoading = () => {
    return <ColumnIndicator type='loading' />;
  }

  renderError = (props) => {
    return <BundleColumnError {...props} />;
  }

  render() {
    const { component: Component, content, publicRoute, ...rest } = this.props;

    if (!publicRoute && !me) {
      const actualUrl = encodeURIComponent(this.props.computedMatch.url);
      return <Route path={this.props.path} component={() => {
        window.location.href = `/auth/sign_in?redirect_uri=${actualUrl}`;
        return null;
      }} />
    }

    return <Route {...rest} render={this.renderComponent} />;
  }
}
