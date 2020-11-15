import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'

class ComposePage extends React.PureComponent {

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
        actions={[
          {
            title: 'Post',
            onClick: this.onOpenCommunityPageSettingsModal,
          },
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}

ComposePage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ComposePage