import {
  createBrowserHistory, // without build
  //createMemoryHistory   // when creating build from webpack
} from 'history'

export default createBrowserHistory()  // without build

// export default createMemoryHistory() // when creating build from webpack