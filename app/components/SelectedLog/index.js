import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import {connect} from 'react-redux'
import moment from 'moment'
import Paper from 'material-ui/Paper'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
const styles = theme => ({
  root: {
    width: '100%'
  },
  time: {
    width: '200px'
  },
  level: {
    width: '200px'
  }
})

class SelectedLog extends Component {
  constructor () {
    super()
    this.getRowClass = this.getRowClass.bind(this)
    this.colors = {
      'debug': 'transparent',
      'info': 'rgba(66, 134, 244, 0.3)',
      'warn': 'rgba(244, 140, 65, 0.3)',
      'error': 'rgba(224, 53, 53, 0.3)'
    }
  }
  getRowClass (level) {
    return {
      backgroundColor: this.colors[level]
    }
  }
  render () {
    const {classes, selectedLog} = this.props
    console.log('selectedLog render')
    return (
      <div className={classes.root}>
        <Paper className={classes.root}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell className={classes.time} >시간</TableCell>
                <TableCell className={classes.level} >레벨</TableCell>
                <TableCell>로그</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLog.logs.map(n => {
                return (
                  <TableRow key={n._id} style={this.getRowClass(n.level)} >
                    <TableCell className={classes.time} >{moment(n.createdAt).format('YYYY-MM-DD HH:mm:ss.SSS')}</TableCell>
                    <TableCell className={classes.level} >{n.level}</TableCell>
                    <TableCell>{n.comment}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {
    selectedLog
  } = state
  return {selectedLog}
}
export default connect(mapStateToProps)(withStyles(styles)(SelectedLog))
