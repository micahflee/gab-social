import React from 'react'
import PropTypes from 'prop-types'
import PageTitle from '../features/ui/util/page_title'
import DeckLayout from '../layouts/deck_layout'

class DeckPage extends React.PureComponent {

  render() {
    const { children } = this.props

    return (
      <DeckLayout>
        <PageTitle path='Deck' />
        {children}
      </DeckLayout>
    )
  }

}

DeckPage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DeckPage