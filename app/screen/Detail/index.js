import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'
import styles from './styles'
import { withRouter } from 'react-router'
import LogRatio from '../../components/LogRatio'
import Timeline from '../../components/Timeline'
import SelectedLog from '../../components/SelectedLog'
import DetailDialog from '../../components/DetailDialog'
class Detail extends Component {
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
          <div style={styles.row} >
            <LogRatio code={code} version={version}/>
          </div>
          <div style={styles.row} >
            <Timeline code={code} version={version}/>
          </div>
          <div style={styles.row} >
            <SelectedLog code={code} version={version} />
          </div>
        </div>
        <DetailDialog />
      </div>
    )
  }
}

export default (withRouter(Detail))
