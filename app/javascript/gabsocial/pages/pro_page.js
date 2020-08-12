import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  VerifiedAccountsPanel,
  ProgressPanel,
} from '../features/ui/util/async_components'

const messages = defineMessages({
  title: { 'id': 'column.pro', 'defaultMessage': 'Pro feed' },
})

export default
@injectIntl
class ProPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { intl, children } = this.props

    const title = intl.formatMessage(messages.title)

    return (
      <DefaultLayout
        title={title}
        page='pro'
        layout={[
          ProgressPanel,
          VerifiedAccountsPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }
}