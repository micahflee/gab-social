import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import { fetchDomainBlocks, expandDomainBlocks } from '../../actions/domain_blocks';
import DomainContainer from '../../containers/domain_container';
import ColumnIndicator from '../../components/column_indicator';
import ScrollableList from '../../components/scrollable_list';

const messages = defineMessages({
  heading: { id: 'column.domain_blocks', defaultMessage: 'Hidden domains' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
});

const mapStateToProps = state => ({
  domains: state.getIn(['domain_lists', 'blocks', 'items']),
  hasMore: !!state.getIn(['domain_lists', 'blocks', 'next']),
});

export default
@connect(mapStateToProps)
@injectIntl
class Blocks extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    domains: ImmutablePropTypes.orderedSet,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.props.dispatch(fetchDomainBlocks());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandDomainBlocks());
  }, 300, { leading: true });

  render() {
    const { intl, domains, hasMore } = this.props;

    if (!domains) {
      return (<ColumnIndicator type='loading' />);
    }

    return (
      <ScrollableList
        scrollKey='domain_blocks'
        onLoadMore={this.handleLoadMore}
        hasMore={hasMore}
        emptyMessage={<FormattedMessage id='empty_column.domain_blocks' defaultMessage='There are no hidden domains yet.' />}
      >
        {domains.map(domain =>
          <DomainContainer key={domain} domain={domain} />
        )}
      </ScrollableList>
    );
  }

}
