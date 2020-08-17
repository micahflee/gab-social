import React from 'react'
import ColumnIndicator from '../components/column_indicator'

export default class GenericNotFound extends React.PureComponent {

  render() {
    return (
      <ColumnIndicator type='missing' />
    )
  }

}
