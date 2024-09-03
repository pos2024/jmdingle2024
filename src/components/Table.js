import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';

const Table = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        prepareRow,
      } = useTable(
        {
          columns,
          data,
          initialState: { pageIndex: 0 }, 
        },
        useSortBy,
        usePagination
      );
    
     
      const tableInstance = useMemo(() => {
        return (
          <table {...getTableProps()} className="table-auto w-full border-collapse">
            <thead className="bg-blue-500 text-white">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={`px-4 py-2 text-left text-sm font-semibold`}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className={rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-4 py-2">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      }, [getTableProps, getTableBodyProps, headerGroups, page, prepareRow]);
    
      return (
        <div className="overflow-x-auto">
          {tableInstance}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-l ${
                canPreviousPage ? 'hover:bg-gray-300' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-r ${
                canNextPage ? 'hover:bg-gray-300' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      );
    }
    

export default Table;
