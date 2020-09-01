import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import {
  LinkFooter,
  TrendsPanel,
  UserSuggestionsPanel,
} from '../features/ui/util/async_components'

class BasicPage extends React.PureComponent {

  render() {
    const {
      children,
      page,
      title,
    } = this.props

    return (
      <DefaultLayout
        noComposeButton
        showBackBtn
        title={title}
        page={page}
        layout={[
          TrendsPanel,
          UserSuggestionsPanel,
          LinkFooter,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}

BasicPage.propTypes = {
  children: PropTypes.node.isRequired,
  page: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default BasicPage