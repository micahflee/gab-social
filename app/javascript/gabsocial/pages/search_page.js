import React from 'react'
import PropTypes from 'prop-types'
import SearchLayout from '../layouts/search_layout'

class SearchPage extends React.PureComponent {

  render() {
    const { children } = this.props

    return (
      <SearchLayout>
        {children}
      </SearchLayout>
    )
  }

}

export default SearchLayout