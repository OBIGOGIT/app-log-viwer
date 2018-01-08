import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'
import thunkMiddleware from 'redux-thunk'

import AppRouter from './config/AppRouter'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory' // createBrowserHistory

import { routerReducer, routerMiddleware } from 'react-router-redux'

import log from './reducers/log'
import selectedLog from './reducers/selectedLog'

const history = createHistory()
const middleware = routerMiddleware(history)
const store = createStore(
  combineReducers({
    log,
    selectedLog,
    router: routerReducer
  }),
  applyMiddleware(middleware, thunkMiddleware)
)

const render = (Component) => {
  ReactDOM.render(
   <AppContainer>
     <MuiThemeProvider theme={createMuiTheme()}>
        <Provider store={store}>
          <Component history={history} />
        </Provider>
      </MuiThemeProvider>
    </AppContainer>,
    document.getElementById('root')
  )
}
render(AppRouter)

if (module.hot) {
  module.hot.accept('./config/AppRouter', () => {
    const newApp = require('./config/AppRouter').default
    render(newApp)
  })
}
