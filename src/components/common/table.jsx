import React, { Component } from 'react'
import TableHeader from './tableheader';
import TableBody from './tablebody';

const Table = ({columns,sortColumn,onSort,data}) => {
    // const {columns,sortColumn,onSort,data}=props; //object destructing
    return ( 
        <table className="table table-striped">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody columns={columns} data={data} />
      </table>
     );
}
 
export default Table;