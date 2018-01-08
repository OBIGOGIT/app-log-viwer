import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import {connect} from 'react-redux'
import * as d3 from 'd3v4'
const styles = theme => ({
  root: {
    width: '100%'
  }
})

class Timeline extends Component {
  constructor () {
    super()
    this.colors = {
      'debug': '#a9a9a9',
      'info': '#4286f4',
      'warn': '#f48c41',
      'error': '#e03535'
    }
    this.height = {
      'debug': 0,
      'info': 1,
      'warn': 2,
      'error': 3
    }
    this.tickLabel = {
      '0': 'debug',
      '1': 'info',
      '2': 'warn',
      '3': 'error'
    }
    this.svg = undefined
    this.scale = undefined
  }
  drawChart () {
    const data = this.props.log.logs
    if (data.length === 0) {
      return
    }
    const margin = {top: 20, right: 20, bottom: 30, left: 60}
    const width = 1200 - margin.left - margin.right
    const height = 100

    this.svg = d3.select('.timeline_chart').append('svg')
    this.svg.attr('width', width + margin.left + margin.right)
    this.svg.attr('height', height)

    this.scale = d3.scaleTime()
    this.scale.domain([new Date(data[data.length - 1].createdAt), new Date(data[0].createdAt)])
    .range([margin.left, width])

    const xaxis = d3.axisBottom(this.scale)
    const gx = this.svg.append('g')
    .attr('class', 'xaxis')
    .call(xaxis)

    this.yScale = d3.scaleBand().domain(['debug', 'info', 'warn', 'error'])
    this.yScale.rangeRound([0, height]).padding(0.2)
    const yaxis = d3.axisLeft(this.yScale)

/*
    this.yScale = d3.scaleLinear().range([height, 0])
    this.yScale.domain([4, -1])
    const yaxis = d3.axisLeft(this.yScale)
    yaxis.ticks(4)
    yaxis.tickFormat((d) => {
      return this.tickLabel[d + '']
    })
    */

    this.svg.append('g')
    .attr('class', 'yaxis')
    .call(yaxis)
    .attr('transform', 'translate(' + margin.left + ', 0)')

    const zoom = d3.zoom()
      .on('zoom', () => {
        // svg.select('g').call(xaxis).selectAll('text').style('font-size', '10px')
        gx.call(xaxis.scale(d3.event.transform.rescaleX(this.scale)))
        this.updateEvents()
      })
    // zoom.scaleTo(this.svg, 10)
    this.svg.call(zoom)
    this.drawEvents(data)
  }
  updateEvents () {
    return this.svg.selectAll('rect.item')
    .attr('x', (d) => {
      return d3.event.transform.applyX(this.scale(new Date(d.createdAt)))
    })
  }
  drawEvents (dates) {
    const events = this.svg.selectAll('rect.item').data(dates)
    events.enter()
    .append('rect')
    .attr('class', 'item')
    .attr('x', (d) => {
      return this.scale(new Date(d.createdAt))
    })
    .attr('y', (e) => {
      // return this.yScale(this.height[e.level])
      return this.yScale(e.level)
    })
    .attr('width', this.yScale.bandwidth())
    .attr('height', this.yScale.bandwidth())
    .style('fill', (e) => {
      return this.colors[e.level]
    })

    events.exit().remove()
  }
  render () {
    const {classes} = this.props
    this.drawChart()
    console.log('timeline render')
    return (
      <div className={classes.root}>
        <div className={'timeline_chart'} ></div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {
    log
  } = state
  return {log}
}
export default connect(mapStateToProps)(withStyles(styles)(Timeline))
