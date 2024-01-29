import React, { Component } from "react";
import _ from "lodash"; //underscore
import PropTypes from 'prop-types';

const Pagenation = (props) => {
  const { itemsCount, pageSize ,currentPage, onPageChange } = props;
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  //[1...pagesCount+1]
  const pages = _.range(1, pagesCount + 1);

  return (
    // <nav>
    //   <ul className="pagenation">
    //     {pages.map(page=>(
    //     <li key={page} className="page-item">
    //         <a href="#" className="page-link">{page}</a>
    //     </li>
    //     ))}
    //   </ul>
    // </nav>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        {/* <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li> */}
        {pages.map((page) => (
          <li key={page} className={page===currentPage?'page-item active':'page-item'}>
            <a
              className="page-link"
              href="#"
              onClick={() => onPageChange(page)}
            >
              {page}
            </a>
          </li>
        ))}
        {/* <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li> */}
      </ul>
    </nav>
  );
};


Pagenation.propTypes={
    itemsCount:PropTypes.number.isRequired,
    pageSize:PropTypes.number.isRequired,
    currentPage:PropTypes.number.isRequired,
    onPageChange:PropTypes.func.isRequired
}
export default Pagenation;
