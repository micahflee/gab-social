import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { expandAccountMediaTimeline } from '../../actions/timelines'
import { getAccountGallery } from '../../selectors'
import PanelLayout from './panel_layout'
import MediaItem from '../media_item'
import MediaGalleryPanelPlaceholder from '../placeholder/media_gallery_panel_placeholder'

class MediaGalleryPanel extends ImmutablePureComponent {

  componentDidMount() {
    const { accountId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(accountId, { limit: 8 }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(expandAccountMediaTimeline(nextProps.accountId, { limit: 8 }))
    }
  }

  render() {
    const {
      account,
      attachments,
      intl,
      isLoading,
    } = this.props

    if (!attachments) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={!!account ? intl.formatMessage(messages.show_all) : undefined}
        headerButtonTo={!!account ? `/${account.get('acct')}/media` : undefined}
      > 
        <div className={[_s.d, _s.flexRow, _s.flexWrap, _s.px10, _s.py10].join(' ')}>
          {
            !!account && attachments.size > 0 &&
            attachments.slice(0, 16).map((attachment, i) => (
              <MediaItem
                isSmall
                key={attachment.get('id')}
                attachment={attachment}
                account={account}
              />
            ))
          }
          {
            !account || (attachments.size === 0 && isLoading) &&
            <div className={[_s.d, _s.w100PC].join(' ')}>
              <MediaGalleryPanelPlaceholder />
            </div>
          }
        </div>
      </PanelLayout>
    )
  }
}

const messages = defineMessages({
  title: { id: 'media_gallery_panel.title', defaultMessage: 'Media' },
  show_all: { id: 'media_gallery_panel.all', defaultMessage: 'Show all' },
})

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.get('id') : -1

  return {
    accountId,
    isLoading: state.getIn(['timelines', `account:${accountId}:media`, 'isLoading'], true), 
    attachments: getAccountGallery(state, accountId),
  }
}

MediaGalleryPanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accountId: PropTypes.string,
  account: ImmutablePropTypes.map,
  isLoading: PropTypes.bool,
  attachments: ImmutablePropTypes.list.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(connect(mapStateToProps)(MediaGalleryPanel))