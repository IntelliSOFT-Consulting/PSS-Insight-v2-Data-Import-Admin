import React, { useState } from 'react';
import {
  DataTable,
  TableHead,
  DataTableRow,
  DataTableColumnHeader,
  TableBody,
  DataTableCell,
  Pagination,
  CircularLoader,
  CenteredContent,
} from '@dhis2/ui';
import { createUseStyles } from 'react-jss';
import { Button } from 'antd';

const useStyles = createUseStyles({
  tableHeader: props => ({
    fontWeight: 'bold !important',
    backgroundColor: props.activeIndicator
      ? '#D9E8F5 !important'
      : props.isOld
      ? '#EBEBEB !important'
      : '',
    '& span': {
      width: '100%',
    },
  }),
});

const Table = ({
  columns,
  tableData = [],
  pageSize,
  pagination,
  emptyMessage,
  loading,
  page,
  setPage,
  ...props
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(pageSize || 15);

  const classes = useStyles(props);

  const handleChangePage = selected => {
    setPage(selected);
  };

  const handleChangeRowsPerPage = ({ selected }) => {
    setRowsPerPage(selected + 1);
  };

  const pageCount = Math.ceil(
    (tableData.length >= 15 ? tableData.length + 1 : tableData.length) /
      rowsPerPage
  );

  const getTableData = () => {
    if (loading) {
      return (
        <DataTableRow>
          <DataTableCell colSpan={columns.length}>
            <CenteredContent>
              <CircularLoader />
            </CenteredContent>
          </DataTableCell>
        </DataTableRow>
      );
    }

    if (tableData.length === 0) {
      return (
        <DataTableCell colSpan={columns.length} className='center'>
          {emptyMessage || 'No data available'}
        </DataTableCell>
      );
    }

    const spannedCells = new Set();
    for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
      const row = tableData[rowIndex];
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];
        const cellValue = row[column.key];
        if (!spannedCells.has(`${rowIndex},${columnIndex}`)) {
          if (column.rowSpan && rowIndex < tableData.length - 1) {
            for (let i = 1; i < column.rowSpan; i++) {
              spannedCells.add(`${rowIndex + i},${columnIndex}`);
            }
          }
          if (column.colSpan && columnIndex < columns.length - 1) {
            for (let i = 1; i < column.colSpan; i++) {
              spannedCells.add(`${rowIndex},${columnIndex + i}`);
            }
          }
        } else {
          row[column.key] = null;
        }
      }
    }

    return tableData.map((row, rowIndex) => (
      <DataTableRow key={rowIndex}>
        {columns.map((column, columnIndex) => {
          if (row[column.key] === null) {
            if (column.colSpan || column.rowSpan) {
              return null;
            }
          }
          return (
            <DataTableCell
              key={`${rowIndex}-${columnIndex}`}
              width={column.width || 'auto'}
              rowSpan={column.rowSpan || 'auto'}
              colSpan={column.colSpan || 'auto'}
              bordered={props.bordered}
            >
              {column.render ? column.render(row, rowIndex) : row[column.key]}
            </DataTableCell>
          );
        })}
      </DataTableRow>
    ));
  };

  return (
    <>
      <DataTable>
        <TableHead>
          <DataTableRow>
            {columns.map((column, index) => (
              <DataTableColumnHeader
                key={index}
                className={`${classes.tableHeader}`}
                width={column.width || 'auto'}
              >
                {column.name}
              </DataTableColumnHeader>
            ))}
          </DataTableRow>
        </TableHead>
        <TableBody>{getTableData()}</TableBody>
      </DataTable>
      {pagination && (
        <div className='pagination'>
          <Button
            disabled={page === 1}
            size='small'
            onClick={() => handleChangePage(page - 1)}
          >
            Prev
          </Button>
          <Button
            disabled={tableData.length < 15}
            size='small'
            onClick={() => handleChangePage(page + 1)}
          >
            Next
          </Button>
        </div>
        // <Pagination
        //   page={page}
        //   pageSize={rowsPerPage}
        //   pageCount={pageCount}
        //   onPageChange={handleChangePage}
        //   onChangeRowsPerPage={handleChangeRowsPerPage}
        //   total={
        //     tableData.length >= 15 ? tableData.length + 1 : tableData.length
        //   }
        //   {...props}
        // />
      )}
    </>
  );
};

export default Table;
