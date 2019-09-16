'use strict';

import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import { INTRODUCTION_VERSION } from '../actions/onboarding';
import { BrowserRouter, Route } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import UI from '../features/ui';
import Introduction from '../features/introduction';
import { fetchCustomEmojis } from '../actions/custom_emojis';
import { hydrateStore } from '../actions/store';
import { connectUserStream } from '../actions/streaming';
import { IntlProvider, addLocaleData } from 'react-intl';
import { getLocale } from '../locales';
import initialState from '../initial_state';
import { me } from '../initial_state';
import ErrorBoundary from '../components/error_boundary';

import '../../styles/gabsocial/components.scss';
import '../../styles/gabsocial/components/buttons.scss';
import '../../styles/gabsocial/components/inputs.scss';
import '../../styles/gabsocial/components/tabs-bar.scss';
import '../../styles/gabsocial/components/dropdown-menu.scss';
import '../../styles/gabsocial/components/modal.scss';
import '../../styles/gabsocial/components/account-header.scss';
import '../../styles/gabsocial/components/user-panel.scss';
import '../../styles/gabsocial/components/compose-form.scss';
import '../../styles/gabsocial/components/group-card.scss';
import '../../styles/gabsocial/components/group-detail.scss';
import '../../styles/gabsocial/components/group-form.scss';
import '../../styles/gabsocial/components/group-sidebar-panel.scss';
import '../../styles/gabsocial/polls.scss';
import '../../styles/gabsocial/introduction.scss';
import '../../styles/gabsocial/emoji_picker.scss';
import '../../styles/gabsocial/about.scss';
import '../../styles/gabsocial/tables.scss';
import '../../styles/gabsocial/admin.scss';
import '../../styles/gabsocial/dashboard.scss';
import '../../styles/gabsocial/rtl.scss';
import '../../styles/gabsocial/accessibility.scss';

const { localeData, messages } = getLocale();
addLocaleData(localeData);

export const store = configureStore();
const hydrateAction = hydrateStore(initialState);

store.dispatch(hydrateAction);
store.dispatch(fetchCustomEmojis());

const mapStateToProps = (state) => {
  const account = state.getIn(['accounts', me]);
  const showIntroduction = account ? state.getIn(['settings', 'introductionVersion'], 0) < INTRODUCTION_VERSION : false;

  return {
    showIntroduction,
  };
};

@connect(mapStateToProps)
class GabSocialMount extends PureComponent {

  static propTypes = {
    showIntroduction: PropTypes.bool,
  };

  render () {
    // Disabling introduction for launch
    // const { showIntroduction } = this.props;
    //
    // if (showIntroduction) {
    //   return <Introduction />;
    // }

    return (
      <BrowserRouter>
        <ScrollContext>
          <Route path='/' component={UI} />
        </ScrollContext>
      </BrowserRouter>
    );
  }

}

export default class GabSocial extends PureComponent {

  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.disconnect = store.dispatch(connectUserStream());
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  render () {
    const { locale } = this.props;

    return (
      <IntlProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <ErrorBoundary>
            <GabSocialMount />
          </ErrorBoundary>
        </Provider>
      </IntlProvider>
    );
  }

}
