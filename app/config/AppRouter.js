import React, { Component } from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'
import Main from '../screen/Main'
class AppRouter extends Component {
  render () {
    return (
      <ConnectedRouter history={this.props.history} >
        <Switch>
          <Route exact path='/' component={Main} />
        </Switch>
      </ConnectedRouter>
    )
  }
}
export default AppRouter
