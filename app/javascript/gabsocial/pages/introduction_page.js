import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import IntroductionLayout from '../layouts/introduction_layout'

export default class IntroductionPage extends React.PureComponent {

  render() {
    return (
      <IntroductionLayout>
        <PageTitle path='Welcome to Gab' />
        {this.props.children}
      </IntroductionLayout>
    )
  }

}