import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import {connect} from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import Paper from 'material-ui/Paper'
import * as selectedLogActions from '../../actions/selectedLog'
import * as detailLogActions from '../../actions/detailLog'
import {bindActionCreators} from 'redux'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import {opacityColors} from '../../libs/const'
import Icon from 'material-ui/Icon'
const styles = theme => ({
  root: {
    width: '100%'
  },
  time: {
    width: '200px'
  },
  level: {
    width: '200px'
  },
  commentArea: {
    width: '100%',
    display: 'flex'
  },
  comment: {
    flex: 1
  },
  rowHover: {
    '&:hover': {
      backgroundColor: '#dddddd !important'
    }
  }
})

class SelectedLog extends Component {
  constructor () {
    super()
    this.getRowClass = this.getRowClass.bind(this)
  }
  getRowClass (level) {
    return {
      backgroundColor: opacityColors[level]
    }
  }
  componentDidMount () {
    const {code, version} = this.props
    axios.get(`http://210.216.54.100:3000/api/log/list?code=${code}&version=${version}`)
    .then((r) => {
      this.props.setSelectedLogs(r.data)
    })
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
                  <TableRow key={n._id} classes={{hover: classes.rowHover}} style={this.getRowClass(n.level)} hover onClick={() => this.props.setDetailLog(n)} >
                    <TableCell className={classes.time} >{moment(n.createdAt).format('YYYY-MM-DD HH:mm:ss.SSS')}</TableCell>
                    <TableCell className={classes.level} >{n.level}</TableCell>
                    <TableCell>
                      <div className={classes.commentArea}>
                        <span className={classes.comment}>{n.comment}</span>
                        {((p) => {
                          if (p) {
                            return (<span><Icon>code</Icon></span>)
                          }
                        })(n.params)}
                      </div>
                    </TableCell>
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
function mapDispatchToProps (dispatch) {
  return bindActionCreators({...selectedLogActions, ...detailLogActions}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectedLog))
