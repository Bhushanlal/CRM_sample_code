import React from "react";
import _ from 'lodash'

export class PaginationFooter extends React.Component {
    render() {
        const { totalRecords, limit, pageNo } = this.props
        let getReminder = totalRecords % limit;
        let totalPages = 0;
        if (getReminder > 0) {
            totalPages = ((totalRecords - getReminder) / limit) + 1;
        } else {
            totalPages = totalRecords / limit;
        }
        let pagesCount = [];
        if (totalPages > 0 && totalPages < 8) {

            for (let ii = 1; ii <= totalPages; ii++) {
                pagesCount.push(
                    <li key={ii}
                        onClick={() => this.props.getPageData(ii)}
                        className={pageNo === ii ? "page-item active" : "page-item"}>
                        <div className="page-link pointer-cursor">{ii}</div>
                    </li>
                );
            }
        } else {
            /*********Pagination with dots for more than 7 pages**********/
            let current = pageNo,
                last = totalPages,
                delta = 2,
                left = current - delta,
                right = current + delta + 1,
                range = [],
                rangeWithDots = [],
                l;

            for (let i = 1; i <= last; i++) {
                if (i === 1 || i === last || (i >= left && i < right)) {
                    range.push(i);
                }
            }

            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }
            /*********End of Pagination with dots for more than 7 pages**********/

            // Parsed pages to show on UI as required.
            _.map(rangeWithDots, (pageVal, pageKey) => {
                pagesCount.push(
                    pageVal === '...' ?
                        <li
                            key={pageKey}
                            className={pageNo === pageVal ? "page-item active" : "page-item"}>
                            <div className="page-link pointer-cursor">{pageVal}</div>
                        </li> :
                        <li
                            key={pageKey}
                            onClick={() => this.props.getPageData(pageVal)}
                            className={pageNo === pageVal ? "page-item active" : "page-item"}>
                            <div className="page-link pointer-cursor">{pageVal}</div>
                        </li>
                );
            })


        }


        let pagesCountHtml = _.map(pagesCount, (html) => html)

        const toRecords = totalRecords > pageNo * limit ? pageNo * limit : totalRecords
        const fromRecords = (pageNo * limit) - (limit - 1)

        return (
            <div className="d-sm-flex justify-content-between align-items-center mt-4 mb-2">
                <div className="visible-entries"> {fromRecords} to {toRecords} of {totalRecords}</div>
                <nav aria-label="..." className="site-pagination">
                    <ul className="pagination mb-0">
                        <li onClick={() => pageNo > 1 ? this.props.getPageData(pageNo - 1) : ''} className={pageNo > 1 ? "page-item" : "page-item disabled"}><a className="page-link" href="#previous" onClick={(e) => e.preventDefault()}>Previous</a></li>
                        {pagesCountHtml}
                        <li onClick={() => (pageNo < totalPages) ? this.props.getPageData(pageNo + 1) : ''} className={(pageNo < totalPages) ? "page-item" : "page-item disabled"}><a className="page-link" href="#next" onClick={(e) => e.preventDefault()}>Next</a></li>
                    </ul>
                </nav>
            </div>
        );
    }
}