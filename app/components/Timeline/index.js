import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import {connect} from 'react-redux'
import moment from 'moment'
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
    this.timeParse = d3.timeParse('%Y-%m-%d %H:%M:%S.%L')
    this.brushed = this.brushed.bind(this)
    this.drawBrushItems = this.drawBrushItems.bind(this)
  }
  drawChart () {
    const data = this.props.log.logs
    if (data.length === 0) {
      return
    }
    const margin = {top: 20, right: 20, bottom: 310, left: 40}
    const margin2 = {top: 430, right: 20, bottom: 30, left: 40}

    const width = 960 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom
    const height2 = 500 - margin2.top - margin2.bottom

    this.startDate = this.timeParse(moment(data[data.length - 1].createdAt).add('second', -1).format('YYYY-MM-DD HH:mm:ss.SSS'))
    this.endDate = this.timeParse(moment(data[0].createdAt).add('second', 1).format('YYYY-MM-DD HH:mm:ss.SSS'))

    this.svg = d3.select('.timeline_chart').append('svg')
    this.svg.attr('width', 960)
    this.svg.attr('height', 500)

    this.focus = this.svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.context = this.svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

    this.brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', this.brushed)



    this.scale = d3.scaleTime()
    this.scale.domain([this.startDate, this.endDate]).range([0, width])

    this.yScale = d3.scaleBand().domain(['debug', 'info', 'warn', 'error'])
    this.yScale.rangeRound([0, height]).padding(0.2)

    this.scale2 = d3.scaleTime().range([0, width]).domain(this.scale.domain())
    this.yScale2 = d3.scaleBand().rangeRound([0, height2]).padding(0.2).domain(this.yScale.domain())


    this.xaxis = d3.axisBottom(this.scale)
    this.xaxis2 = d3.axisBottom(this.scale2)



    const yaxis = d3.axisLeft(this.yScale)

    this.gx = this.focus.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(this.xaxis)

    this.focus.append('g')
    .attr('class', 'yaxis')
    .call(yaxis)

    this.context.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(0,' + height2 + ')')
    .call(this.xaxis2)

    this.context.append('g')
    .attr('class', 'brush')
    .call(this.brush)
    .call(this.brush.move, this.scale.range());


    this.zoom = d3.zoom()
    .scaleExtent([1, 1000])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', () => {
      this.updateEvents()
    })
    // zoom.scaleTo(this.svg, 10)

    this.svg.append('rect')
    .attr('class', 'zoom')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .style('fill', 'transparent')
    .call(this.zoom)
    // this.svg.call(zoom)
    this.drawEvents(data)
    this.drawBrushItems(data)
  }
  updateEvents () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
      return // ignore zoom-by-brush
    }
    const t = d3.event.transform
    this.scale.domain([this.startDate, this.endDate])
    this.gx.call(this.xaxis.scale(d3.event.transform.rescaleX(this.scale)))
    this.focus.select('.xaxis').call(this.xaxis);

    this.context.select('.brush').call(this.brush.move, this.scale.range().map(t.invertX, t));

    return this.focus.selectAll('rect.item')
    .attr('x', (d) => {
      return d3.event.transform.applyX(this.scale(this.timeParse(d.createdAt)))
    })
  }
  brushed () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom

    const margin = {top: 20, right: 20, bottom: 110, left: 40}
    const width = 960 - margin.left - margin.right
    var s = d3.event.selection || this.scale2.range()

    this.scale.domain(s.map(this.scale2.invert, this.scale2))
    this.gx.call(this.xaxis.scale(this.scale))
    this.focus.select('.xaxis').call(this.xaxis);
    this.focus.selectAll('rect.item')
    .attr('x', (d) => {
      return this.scale(this.timeParse(d.createdAt))
    })
    this.svg.select('.zoom')
    .call(this.zoom.transform, 
    d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
  }
  drawBrushItems (dates) {
    this.dots2 = this.context.selectAll('rect.item').data(dates)
    this.dots2.enter()
    .append('rect')
    .attr('class', 'item')
    .attr('x', (d) => {
      return this.scale2(this.timeParse(d.createdAt))
    })
    .attr('y', (e) => {
      return this.yScale2(e.level)
    })
    .attr('width', this.yScale2.bandwidth())
    .attr('height', this.yScale2.bandwidth())
    .style('fill', (e) => {
      return this.colors[e.level]
    })

    this.dots2.exit().remove()
  }
  drawEvents (dates) {
    this.dots = this.focus.selectAll('rect.item').data(dates)
    this.dots.enter()
    .append('rect')
    .attr('class', 'item')
    .attr('x', (d) => {
      return this.scale(this.timeParse(d.createdAt))
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

    this.dots.exit().remove()
  }
  render () {
    const {classes} = this.props
    this.drawChart()
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
