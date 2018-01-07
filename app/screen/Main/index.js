import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'
import styles from './styles'
import { withRouter } from 'react-router'
import Test from '../../components/Test'
// import axios from 'axios'
class Main extends Component {
  render () {
    return (
      <div style={styles.main} >
        <AppBar position='fixed' >
          <Toolbar>
            <Typography type='title' color='inherit' > ll</Typography>
          </Toolbar>
        </AppBar>
        <div style={styles.content} >
          <Test />
        </div>
      </div>
    )
  }
}
export default withRouter(Main)
