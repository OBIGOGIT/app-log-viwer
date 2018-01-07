import React, { Component } from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'
import Main from '../screen/Main'
import Detail from '../screen/Detail'
class AppRouter extends Component {
  render () {
    return (
      <ConnectedRouter history={this.props.history} >
        <Switch>
          <Route exact path='/' component={Main} />
          <Route exact path='/detail' component={Detail} />
        </Switch>
      </ConnectedRouter>
    )
  }
}
export default AppRouter
