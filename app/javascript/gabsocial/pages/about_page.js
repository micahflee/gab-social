import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import AboutLayout from '../layouts/about_layout'

class AboutPage extends React.PureComponent {

  render() {
    const { children, title } = this.props

    return (
      <AboutLayout title={title}>
        <PageTitle path={title} />
        {children}
      </AboutLayout>
    )
  }

}

AboutPage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default AboutPage