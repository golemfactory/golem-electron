/**
 * [TimeoutPromoise]
 * @param  {Number} ms      [Time period as milliseconds]
 * @param  {Object} promise [Given task, expecting done in given ms]
 * @param  {String} purpose [Simple description of purpose of given promise]
 * @return {Object}         [First result as object of given promises]
 */
export default function(ms, promise, purpose){

  /**
   * [Timeout condition for http requests]
   * @param  {Object} (resolve, reject)
   * @return {Object} [If http request is not completed in this given period of time, timeout promise will return reject with error message.]
   */
  let timeout = new Promise((resolve, reject) => {
    let timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(`Timed out after ${ms} ms while fetching ${purpose} data.`)
    }, ms)
  })

  return Promise.race([
    promise,
    timeout
  ])
}
