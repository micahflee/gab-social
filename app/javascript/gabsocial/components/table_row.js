import React from 'react'
import PropTypes from 'prop-types'
import { CX } from '../constants'
import Text from './text'

class TableRow extends React.PureComponent {

  render() {
    const {
      id,
      row,
      total,
      index,
    } = this.props

    if (!Array.isArray(row)) return null

    const isLast = index === total - 1
    const classes = CX({
      d: 1,
      flexRow: 1, 
      borderBottom1PX: !isLast,
      borderColorSecondary: !isLast,
    })

    const style = {
      width: `${100 / row.length}%`
    }
    
    return (
      <tr className={classes}>
        {
          row.map((item, i) => {
            const itemClasses = CX({
              d: 1,
              px15: 1,
              py10: 1,
              borderRight1PX: i !== row.length - 1,
              borderColorSecondary: i !== row.length - 1,
            })
            return (
              <td className={itemClasses} style={style} key={`row-data-${id}-${i}`}>
                <Text>
                  {row[i]}
                </Text>
              </td>
            )
          })
        }
      </tr>
    )
  }

}

TableRow.propTypes = {
  row: PropTypes.object,
  tableId: PropTypes.string,
  total: PropTypes.number,
  index: PropTypes.number,
}

export default TableRow