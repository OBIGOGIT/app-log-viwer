import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'
import styles from './styles'
import { withRouter } from 'react-router'
import LogRatio from '../../components/LogRatio'
import Timeline from '../../components/Timeline'
import Timeline2 from '../../components/Timeline2'
import SelectedLog from '../../components/SelectedLog'
import * as logActions from '../../actions/log'
import * as selectedLogActions from '../../actions/selectedLog'
import axios from 'axios'
class Detail extends Component {
  componentDidMount () {
    const {code, version} = this.props.history.location.state.key
    axios.get(`http://210.216.54.100:3000/api/log/list?code=${code}&version=${version}`)
    .then((r) => {
      this.props.setLogs(r.data)
      this.props.setSelectedLogs(r.data)
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
        {/*
          <div style={styles.row} >
            <LogRatio code={code} version={version}/>
            <Timeline />
          </div>
          */}
          <div style={styles.row} >
            <Timeline2 />
          </div>
          <div style={styles.row} >
            <SelectedLog />
          </div>
        </div>
      </div>
    )
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({...logActions, ...selectedLogActions}, dispatch)
}

export default connect(null, mapDispatchToProps)(withRouter(Detail))
