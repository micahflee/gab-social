import React from 'react'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  ProgressPanel,
  ShopPanel,
  SignUpPanel,
  VerifiedAccountsPanel,
} from '../features/ui/util/async_components'

class NewsPage extends React.PureComponent {

  render() {
    const { children, title } = this.props

    return (
      <DefaultLayout
        page='news'
        title={title}
        noComposeButton
        showBackBtn
        layout={[
          SignUpPanel,
          ProgressPanel,
          VerifiedAccountsPanel,
          ShopPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}

NewsPage.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}

export default NewsPage