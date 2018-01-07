import React, { Component } from 'react'
import SummaryList from './SummaryList'
import { withStyles } from 'material-ui/styles'
import axios from 'axios'
const styles = theme => ({
  root: {
    width: '100%'
  }
})

class Summary extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
  }
  componentDidMount () {
    axios.get('http://210.216.54.100:3000/api/log/summary')
    .then((r) => {
      console.log(r)
      this.setState({
        list: r.data
      })
    })
  }
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <SummaryList list={this.state.list} />
      </div>
    )
  }
}
export default withStyles(styles)(Summary)
