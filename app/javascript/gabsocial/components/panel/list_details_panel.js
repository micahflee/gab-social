import { defineMessages, injectIntl } from 'react-intl';
import { fetchSuggestions, dismissSuggestion } from '../../actions/suggestions';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PanelLayout from './panel_layout';

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  title: { id: 'lists.panel_title', defaultMessage: 'On This List ({count})' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
});

const mapStateToProps = state => ({
  // accountIds: state.getIn(['listEditor', 'accounts', 'items']),
});

const mapDispatchToProps = dispatch => {
  return {

  }
};

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListDetailsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  handleShowAllLists() {

  }

  render() {
    const { intl } = this.props;

    const count = 10

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title, { count })}
        buttonTitle={intl.formatMessage(messages.show_all)}
        buttonAction={this.handleShowAllLists}
      >
        <div className={_s.default}>

        </div>
      </PanelLayout>
    );
  };
};