// import Raven from 'raven-js';

function init(){
  // Raven.config('https://1c961580d4d3ceb8b7949d5ac96fa1d1@o4506635910119424.ingest.sentry.io/4506635953831936',{
  //   release:'1-0-0',
  //   environment:'development-test',
  // }).install()
}
function log(error){
    // Raven.captureException(error);
    console.error(error);
}
export default{
    init,
    log
};