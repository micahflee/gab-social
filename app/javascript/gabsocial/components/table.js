import React from 'react'
import PropTypes from 'prop-types'
import Text from './text'
import TableColumnHeader from './table_column_header'
import TableRow from './table_row'

class Table extends React.PureComponent {

  render() {
    const {
      id,
      columns,
      rows,
    } = this.props

    return (
      <table className={[_s.d, _s.border1PX, _s.borderColorSecondary].join(' ')}>
        {
          Array.isArray(columns) &&
          <tr className={[_s.d, _s.flexRow, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            {
              columns.map((column, i) => (
                <TableColumnHeader
                  tableId={id}
                  column={column}
                  key={`table-${id}-column-header-${i}`}
                  total={columns.length}
                  index={i}
                />
              ))
            }
          </tr>
        }
        {
          Array.isArray(rows) &&
          rows.map((row, i) => (
            <TableRow
              tableId={id}
              row={row}
              key={`table-${id}-row-${i}`}
              total={rows.length}
              index={i}
            />
          ))
        }
      </table>
    )
  }

}

Table.propTypes = {
  id: PropTypes.string,
  columns: PropTypes.array,
  rows: PropTypes.array,
}

export default Table