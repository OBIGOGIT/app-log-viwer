import React, { Component } from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import { withRouter } from 'react-router'
import moment from 'moment'
const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
})
class SummaryList extends Component {
  constructor () {
    super()
    this.detail = this.detail.bind(this)
  }
  detail (item) {
    console.log(item)
    this.props.history.push({
      pathname: '/detail',
      state: {
        key: item._id
      }
    })
  }
  render () {
    const {classes, list} = this.props
    return (
      <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>코드</TableCell>
            <TableCell>버전</TableCell>
            <TableCell>마지막 로그 시간</TableCell>
            <TableCell numeric>개수</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map(item => {
            return (
              <TableRow key={item._id.code + item._id.version} onClick={() => this.detail(item)} >
                <TableCell>{item._id.code}</TableCell>
                <TableCell>{item._id.version}</TableCell>
                <TableCell>{moment(item.lastTime).fromNow()}</TableCell>
                <TableCell numeric>{item.count}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
    )
  }
}
export default withRouter(withStyles(styles)(SummaryList))
