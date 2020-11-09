import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import NewsLayout from '../layouts/news_layout'

class NewsPage extends React.PureComponent {

  render() {
    const { children, title } = this.props

    return (
      <NewsLayout title={title}>
        <PageTitle path={title} />
        {children}
      </NewsLayout>
    )
  }

}

NewsPage.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}

export default NewsPage