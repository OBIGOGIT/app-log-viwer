import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import {connect} from 'react-redux'
import {backgroundColors} from '../../libs/const'
import * as detailLogActions from '../../actions/detailLog'
import {bindActionCreators} from 'redux'
import ReactJson from 'react-json-view'
import Button from 'material-ui/Button'
import Icon from 'material-ui/Icon'
import moment from 'moment'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

const styles = theme => ({
  title: {
    color: '#ffffff',
    fontSize: '1.3em'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '3em',
    paddingTop: '2em'
  },
  colTitle: {
  },
  colContent: {
    paddingLeft: '2em',
    flex: 1
  }
})

class Timeline extends Component {
  constructor () {
    super()
    this.handleClose = this.handleClose.bind(this)
  }
  handleClose () {
    this.props.setDetailLog(undefined)
  }
  render () {
    const {classes, detailLog} = this.props
    const {comment, params, level='', createdAt} = detailLog.log || {}
    return (
      <Dialog
        fullScreen={true}
        open={!!detailLog.log}
        onClose={this.handleClose}
      >
        <DialogTitle disableTypography={true} className={classes.title} style={{backgroundColor: backgroundColors[level]}} >{level.toUpperCase()}</DialogTitle>
        <DialogContent>
          <div className={classes.content}  >
            <div className={classes.row} >
              <span className={classes.colTitle} >
                <Icon>today</Icon>
              </span>
              <span className={classes.colContent} >{moment(createdAt).format('YYYY년 MM월 DD일 HH시 mm분 ss.SSS초')}</span>
            </div>
            <div className={classes.row} >
              <span className={classes.colTitle} >
                <Icon>comment</Icon>
              </span>
              <span className={classes.colContent} >{comment}</span>
            </div>
            {(() => {
              if (params) {
                return (<div className={classes.row} >
                  <span className={classes.colTitle} >
                    <Icon>code</Icon>
                  </span>
                  <div className={classes.colContent} >
                    <ReactJson src={JSON.parse(params)} displayDataTypes={false} collapsed={1} />
                  </div>
                </div>)
              } else {
                return null
              }
            })()}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='primary'>닫기</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
function mapStateToProps (state) {
  const {
    detailLog
  } = state
  return {detailLog}
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({...detailLogActions}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Timeline))
