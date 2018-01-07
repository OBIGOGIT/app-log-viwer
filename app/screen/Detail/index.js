import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'
import styles from './styles'
import { withRouter } from 'react-router'
import LogRatio from '../../components/LogRatio'
import axios from 'axios'
class Detail extends Component {
  constructor () {
    super()
    this.state = {
      items: []
    }
  }
  componentDidMount () {
    console.log(this.props.history)
    const {code, version} = this.props.history.location.state.key
    console.log(code, version)
    axios.get(`http://210.216.54.100:3000/api/log/list?code=${code}&version=${version}`)
    .then((r) => {
      console.log(r)
      this.setState({
        items: r.data
      })
    })
  }
  render () {
    const {code, version} = this.props.history.location.state.key
    return (
      <div style={styles.main} >
        <AppBar position='fixed' >
          <Toolbar>
            <Typography type='title' color='inherit' > </Typography>
          </Toolbar>
        </AppBar>
        <div style={styles.content} >
          <LogRatio code={code} version={version}/>
        </div>
      </div>
    )
  }
}
export default withRouter(Detail)
