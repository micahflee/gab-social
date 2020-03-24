import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import { blockDomain, unblockDomain } from '../actions/domain_blocks'
import { openModal } from '../actions/modal'
import Domain from '../components/domain'

const messages = defineMessages({
  blockDomainConfirm: { id: 'confirmations.domain_block.confirm', defaultMessage: 'Hide entire domain' },
})

const mapDispatchToProps = (dispatch, { intl }) => ({
  onBlockDomain (domain) {
    dispatch(openModal('BLOCK_DOMAIN', {
      domain,
    }))
  },

  onUnblockDomain (domain) {
    dispatch(unblockDomain(domain))
  },
})

export default injectIntl(connect(null, mapDispatchToProps)(Domain))
