import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import NewsLayout from '../layouts/news_layout'

class NewsPage extends React.PureComponent {

  render() {
    const { children } = this.props

    return (
      <NewsLayout>
        <PageTitle path='News' />
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