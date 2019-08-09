import ImmutablePropTypes from 'react-immutable-proptypes';
import { createSelector } from 'reselect';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ColumnIndicator from '../../components/column_indicator';
import Column from '../../components/column';
import { fetchLists } from '../../actions/lists';
import ColumnLink from '../../components/column_link';
import ColumnSubheading from '../../components/column_subheading';
import NewListForm from './components/new_list_form';
import ScrollableList from '../../components/scrollable_list';

const messages = defineMessages({
  heading: { id: 'column.lists', defaultMessage: 'Lists' },
  subheading: { id: 'lists.subheading', defaultMessage: 'Your lists' },
  add: { id: 'lists.new.create', defaultMessage: 'Add List' },
});

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')));
});

const mapStateToProps = state => ({
  lists: getOrderedLists(state),
});

export default @connect(mapStateToProps)
@injectIntl
class Lists extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    lists: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.dispatch(fetchLists());
  }

  render() {
    const { intl, lists } = this.props;

    if (!lists) {
      return (<ColumnIndicator type='loading' />);
    }

    return (
      <Column icon='list-ul' heading={intl.formatMessage(messages.heading)} backBtn='slim'>
        <br />
        <ColumnSubheading text={intl.formatMessage(messages.add)} />
        <NewListForm />
        <br />
        <ColumnSubheading text={intl.formatMessage(messages.subheading)} />
        <ScrollableList
          scrollKey='lists'
          emptyMessage={<FormattedMessage id='empty_column.lists' defaultMessage="You don't have any lists yet. When you create one, it will show up here." />}
        >
          {lists.map(list =>
            <ColumnLink
              key={list.get('id')}
              to={`/list/${list.get('id')}`}
              icon='list-ul'
              text={list.get('title')}
            />
          )}
        </ScrollableList>
      </Column>
    );
  }

}
