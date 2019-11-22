/** util */
const sum = (arr: number[]) => arr.reduce((prev, cur) => prev + cur, 0);

/** type */
interface Page {
  current: number;
  total: number;
}

/**
 * sample asynchronous functions.
 */
const pagePrmsGen = (currentPage: number) =>
  new Promise<Page>(res => {
    const p: Page = {
      current: currentPage,
      total: 3
    };
    return setTimeout(() => res(p), 500);
  });
const subPrms = new Promise<number>(res => setTimeout(() => res(250), 250));
const requestSequential = (currentPage: number) =>
  pagePrmsGen(currentPage)
    .then(page => ({ page, subPrms: [subPrms, subPrms] }))
    .then(async ({ page, subPrms }) => {
      await Promise.all(subPrms);
      return page;
    });

/**
 * generator.
 */
const getDataFetcherGenerator = function*() {
  let pageIdx = 1;
  let total!: number;
  while (total === undefined || pageIdx < total) {
    const page = yield requestSequential(pageIdx);
    total = (page as Page).total;
    pageIdx++;
  }
  return requestSequential(pageIdx);
};

/**
 * example for using on view or view-model.
 */
const iterator = getDataFetcherGenerator();
export const responses: Page[] = [];

export const getAll = (arg?: Page) => {
  const result = iterator.next(arg);
  const prms = result.value.then(d => {
    responses.push(d);
    return d;
  });
  return result.done ? prms : prms.then<Page>(getAll);
};

// getAll().then(() => console.log(responses));;
