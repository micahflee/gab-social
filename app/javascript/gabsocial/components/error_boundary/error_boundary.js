import { FormattedMessage } from 'react-intl';

import './error_boundary.scss';

export default class ErrorBoundary extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    hasError: false,
    stackTrace: undefined,
    componentStack: undefined,
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      stackTrace: error.stack,
      componentStack: info && info.componentStack,
    });
  }

  render() {
    const { hasError } = this.state;

    if (!hasError) return this.props.children;

    return (
      <div className='error-boundary'>
        <div className='error-boundary__container'>
          <FormattedMessage id='alert.unexpected.message' defaultMessage='Error' />
          <a className='error-boundary__link' href='/home'>Return Home</a>
        </div>
      </div>
    );
  }

}
