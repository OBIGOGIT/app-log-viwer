import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import * as d3 from 'd3v4'
import axios from 'axios'
import {colors} from '../../libs/const'
const styles = theme => ({
  root: {
    width: '100%'
  }
})

class LogRatio extends Component {
  drawChart (data) {
    const totalCount = d3.sum(data, (item) => {
      return item.count
    })
    data = data.map((item) => {
      item.color = colors[item._id]
      return item
    })
    const width = 340
    const height = 340
    const radius = 130
    const arc = d3.arc().outerRadius(radius - 70).innerRadius(100)
    const pie = d3.pie().sort(null).value((d) => {
      return d.count
    })
    const svg = d3.select('.donut_chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')

    g.append('path')
    .attr('d', arc)
    .style('fill', (d, i) => {
      return d.data.color
    })

    g.append('text')
    .attr('transform', (d) => {
      const _d = arc.centroid(d)
      _d[0] *= 1.5  // multiply by a constant factor
      _d[1] *= 1.5  // multiply by a constant factor
      return 'translate(' + _d + ')'
    })
    .attr('dy', '.50em')
    .style('text-anchor', 'middle')
    .text((d) => {
      return d.data.count
    })

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '3em')
      .attr('y', 20)
      .text(totalCount)
  }
  componentDidMount () {
    const {code, version} = this.props
    axios.get(`http://210.216.54.100:3000/api/log/count?code=${code}&version=${version}`)
    .then((r) => {
      this.drawChart(r.data)
    })
  }
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <div className={'donut_chart'} ></div>
      </div>
    )
  }
}
export default withStyles(styles)(LogRatio)
