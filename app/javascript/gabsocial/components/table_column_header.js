import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Text from './text'

class TableColumnHeader extends React.PureComponent {

  render() {
    const {
      column,
      total,
      index,
    } = this.props

    const isLast = index === total - 1
    const classes = CX({
      d: 1,
      px15: 1,
      py10: 1, 
      borderRight1PX: !isLast,
      borderColorSecondary: !isLast,
    })

    const style = {
      width: `${100 / total}%`
    }

    return (
      <th className={classes} style={style}>
        <Text size='medium' weight='medium'>
          {column}
        </Text>
      </th>
    )
  }

}

TableColumnHeader.propTypes = {
  column: PropTypes.object,
  index: PropTypes.number,
  total: PropTypes.number,
  tableId: PropTypes.string,
}

export default TableColumnHeader