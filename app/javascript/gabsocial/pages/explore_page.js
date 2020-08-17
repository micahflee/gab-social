import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import ExploreLayout from '../layouts/explore_layout'

class ExplorePage extends React.PureComponent {

  render() {
    const { children, title } = this.props

    return (
      <ExploreLayout title={title}>
        <PageTitle path={title} />
        {children}
      </ExploreLayout>
    )
  }

}

ExplorePage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default ExplorePage