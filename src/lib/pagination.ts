import { URLSearchParams } from 'url';

import { Request } from 'express';

export default (req: Request, totalPages = 10) => {
  const perPage = 5;
  let currentPage = Number(req.query.page) || 1;
  currentPage = parseInt(String(currentPage));
  const pagesElement = [];
  if (totalPages > 1) {
    // Pagination Logic
    let startPage = currentPage - 2 < 1 ? 1 : currentPage - 2;
    let endPage = startPage + perPage;
    if (currentPage <= 2) {
      startPage = 1;
    }
    if (totalPages < endPage) endPage = totalPages + 1;
    if (totalPages > perPage && startPage > endPage - perPage)
      startPage = endPage - 7;

    // if(totalPages < endPage) endPage = totalPages +1;

    //next and back page logic
    const backPageNo = currentPage <= 1 ? 1 : currentPage - 1;
    const nextPageNo = currentPage >= totalPages ? totalPages : currentPage + 1;

    pagesElement.push({
      text: '<img src="/icons/arrow-left.svg" alt="prev"><img src="/icons/arrow-left-white.svg" alt="prev">',
      classes:
        backPageNo == currentPage
          ? ' disabled dual-image-switch-on-hover'
          : ' dual-image-switch-on-hover',
      url:
        req.baseUrl +
        '?' +
        new URLSearchParams({
          ...req.query,
          page: String(backPageNo),
        }),
    });

    for (let i = startPage; i < endPage; i++) {
      pagesElement.push({
        text: i,
        classes: i == currentPage ? ' disabled active' : '',
        url:
          req.baseUrl +
          '?' +
          new URLSearchParams({
            ...req.query,
            page: String(i),
          }),
      });
    }

    pagesElement.push({
      text: '<img src="/icons/arrow-right.svg" alt="next"><img src="/icons/arrow-right-white.svg" alt="next">',
      classes:
        nextPageNo == currentPage
          ? ' disabled dual-image-switch-on-hover'
          : ' dual-image-switch-on-hover',
      url:
        req.baseUrl +
        '?' +
        new URLSearchParams({
          ...req.query,
          page: String(nextPageNo),
        }),
    });
  }
  return pagesElement;
};
