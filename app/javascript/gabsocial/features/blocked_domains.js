import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { unblockDomain, fetchDomainBlocks, expandDomainBlocks } from '../actions/domain_blocks'
import ColumnIndicator from '../components/column_indicator'
import List from '../components/list'

const messages = defineMessages({
  heading: { id: 'column.domain_blocks', defaultMessage: 'Hidden domains' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
  emptyMessage: { id: 'empty_column.domain_blocks', defaultMessage: 'There are no hidden domains yet.' },
});

const mapDispatchToProps = (dispatch) => ({
  onExpandDomainBlocks() {
    dispatch(expandDomainBlocks())
  },

  onFetchDomainBlocks() {
    dispatch(fetchDomainBlocks())
  },

  onUnblockDomain (domain) {
    dispatch(unblockDomain(domain))
  },
})

const mapStateToProps = (state) => ({
  domains: state.getIn(['domain_lists', 'blocks', 'items']),
  hasMore: !!state.getIn(['domain_lists', 'blocks', 'next']),
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class Blocks extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    hasMore: PropTypes.bool,
    domains: ImmutablePropTypes.orderedSet,
    onUnblockDomain: PropTypes.func.isRequired,
    onFetchDomainBlocks: PropTypes.func.isRequired,
    onExpandDomainBlocks: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.onFetchDomainBlocks()
  }

  handleUnblockDomain = (domain) => {
    this.props.onUnblockDomain(domain)
  }

  handleLoadMore = debounce(() => {
    this.props.onExpandDomainBlocks()
  }, 300, { leading: true })

  render() {
    const { intl, domains, hasMore } = this.props

    if (!domains) {
      return <ColumnIndicator type='loading' />
    }

    const items = domains.map((domain) => {
      return {
        title: intl.formatMessage(messages.unblockDomain, { domain }),
        onClick: () => this.handleUnblockDomain(domain),
        hideArrow: true,
      }
    })

    return (
      <List
        scrollKey='domain_blocks'
        onLoadMore={this.handleLoadMore}
        hasMore={hasMore}
        emptyMessage={intl.formatMessage(messages.emptyMessage)}
        items={items}
      />
    )
  }

}
