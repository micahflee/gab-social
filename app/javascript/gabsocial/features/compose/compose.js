import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';
import spring from 'react-motion/lib/spring';
import {
  changeComposing,
  mountCompose,
  unmountCompose,
} from '../../actions/compose';
import { mascot } from '../../initial_state';
import Motion from '../ui/util/optional_motion';
import ComposeFormContainer from './containers/compose_form_container';
import SearchContainer from './containers/search_container';
import SearchResultsContainer from './containers/search_results_container';
import NavigationBar from './components/navigation_bar';
import elephantUIPlane from '../../../images/logo_ui_column_footer.png';

const messages = defineMessages({
  start: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
  home_timeline: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  public: { id: 'navigation_bar.public_timeline', defaultMessage: 'Federated timeline' },
  community: { id: 'navigation_bar.community_timeline', defaultMessage: 'Local timeline' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  compose: { id: 'navigation_bar.compose', defaultMessage: 'Compose new gab' },
});

const mapStateToProps = (state, ownProps) => ({
  columns: state.getIn(['settings', 'columns']),
  showSearch: ownProps.isSearchPage,
});

export default @connect(mapStateToProps)
@injectIntl
class Compose extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    columns: ImmutablePropTypes.list.isRequired,
    showSearch: PropTypes.bool,
    isSearchPage: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    const { isSearchPage } = this.props;

    if (!isSearchPage) {
      this.props.dispatch(mountCompose());
    }
  }

  componentWillUnmount () {
    const { isSearchPage } = this.props;

    if (!isSearchPage) {
      this.props.dispatch(unmountCompose());
    }
  }

  onFocus = () => {
    this.props.dispatch(changeComposing(true));
  }

  onBlur = () => {
    this.props.dispatch(changeComposing(false));
  }

  render () {
    const { showSearch, isSearchPage, intl } = this.props;

    let header = '';

    return (
      <div className='drawer' role='region' aria-label={intl.formatMessage(messages.compose)}>
        {header}

        {isSearchPage && <SearchContainer /> }

        <div className='drawer__pager'>
          {!isSearchPage && <div className='drawer__inner' onFocus={this.onFocus}>
            <NavigationBar onClose={this.onBlur} />

            <ComposeFormContainer />

            <div className='drawer__inner__gabsocial'>
              <img alt='' draggable='false' src={mascot || elephantUIPlane} />
            </div>
          </div>}

          <Motion defaultStyle={{ x: isSearchPage ? 0 : -100 }} style={{ x: spring(showSearch || isSearchPage ? 0 : -100, { stiffness: 210, damping: 20 }) }}>
            {({ x }) => (
              <div className='drawer__inner darker' style={{ transform: `translateX(${x}%)`, visibility: x === -100 ? 'hidden' : 'visible' }}>
                <SearchResultsContainer />
              </div>
            )}
          </Motion>
        </div>
      </div>
    );
  }

}
