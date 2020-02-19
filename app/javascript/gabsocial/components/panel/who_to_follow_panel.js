import { defineMessages, injectIntl } from 'react-intl';
import { fetchSuggestions, dismissSuggestion } from '../../actions/suggestions';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AccountContainer from '../../containers/account_container';
import PanelLayout from './panel_layout';

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  title: { id: 'who_to_follow.title', defaultMessage: 'Who to Follow' },
});

const mapStateToProps = state => ({
  suggestions: state.getIn(['suggestions', 'items']),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchSuggestions: () => dispatch(fetchSuggestions()),
    dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
  }
};

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class WhoToFollowPanel extends ImmutablePureComponent {

  static propTypes = {
    suggestions: ImmutablePropTypes.list.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    dismissSuggestion: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    this.props.fetchSuggestions();
  }

  render() {
    const { intl, /* suggestions, */ dismissSuggestion } = this.props;
    // : testing!!! :
    const suggestions = [
      "1",
    ]
    // if (suggestions.isEmpty()) {
    //   return null;
    // }

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <div className={_s.default}>
          {suggestions && suggestions.map(accountId => (
            <AccountContainer
              key={accountId}
              id={accountId}
              actionIcon='times'
              actionTitle={intl.formatMessage(messages.dismissSuggestion)}
              onActionClick={dismissSuggestion}
            />
          ))}
        </div>
      </PanelLayout>
    );
  };
};