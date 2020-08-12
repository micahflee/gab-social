import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import { MODAL_EDIT_SHORTCUTS } from '../constants'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  TrendsPanel,
  WhoToFollowPanel,
} from '../features/ui/util/async_components'

const messages = defineMessages({
  shortcuts: { id: 'shortcuts', defaultMessage: 'Shortcuts' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenEditShortcutsModal() {
    dispatch(openModal(MODAL_EDIT_SHORTCUTS))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class ShortcutsPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenEditShortcutsModal: PropTypes.func.isRequired,
  }

  handleOnOpenEditShortcutsModal = () => {
    this.props.onOpenEditShortcutsModal()
  }

  render() {
    const { intl, children } = this.props

    const title = intl.formatMessage(messages.shortcuts)

    return (
      <DefaultLayout
        title={title}
        page='shortcuts'
        actions={[
          {
            icon: 'cog',
            onClick: this.handleOnOpenEditShortcutsModal,
          },
        ]}
        layout={[
          TrendsPanel,
          WhoToFollowPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }
}