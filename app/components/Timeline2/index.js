/* eslint-disable */
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import {connect} from 'react-redux'
import * as d3 from 'd3v4'
const styles = theme => ({
  root: {
    width: '100%'
  }
})

class Timeline2 extends Component {
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
    this.yScale = undefined
    this.zoomed = this.zoomed.bind(this)
    this.brushed = this.brushed.bind(this)
  }
  drawChart () {
    const data = this.props.log.logs
    if (data.length === 0) {
      return
    }

    this.svg = d3.select('.timeline_chart2 > svg')
    // this.svg.attr('width', 960).attr('height', 500)
    const margin = {top: 20, right: 20, bottom: 310, left: 40}
    const margin2 = {top: 430, right: 20, bottom: 30, left: 40}
    /*
    const width = +this.svg.attr('width') - margin.left - margin.right
    const height = +this.svg.attr('height') - margin.top - margin.bottom
    const height2 = +this.svg.attr('height') - margin2.top - margin2.bottom
    */
    const width = 960 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom
    const height2 = 500 - margin2.top - margin2.bottom


    this.x = d3.scaleTime().range([0, width])
    this.x2 = d3.scaleTime().range([0, width])
    this.y = d3.scaleBand().range([height, 0])
    this.y2 = d3.scaleBand().range([height2, 0])

    this.xAxis = d3.axisBottom(this.x)
    this.xAxis2 = d3.axisBottom(this.x2)
    this.yAxis = d3.axisLeft(this.y)

    this.brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', this.brushed)

    this.zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', this.zoomed);


/*
    const area = d3.path().rect()
    .x((d) => { return x(new Date(d.createdAt)) })
    .y0(height)
    .y1((d) => { return y(d.level) })

    const area2 = d3.path().rect()
    .x((d) => { return x2(new Date(d.createdAt)) })
    .y0(height2)
    .y1((d) => { return y2(d.level) })
    */





    this.svg.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height)

    this.focus = this.svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.context = this.svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');



/*
    const events = this.svg.selectAll('rect.item').data(dates)
    events.enter()
    .append('rect')
    .attr('class', 'item')
    .attr('x', (d) => {
      return this.scale(new Date(d.createdAt))
    })
    .attr('y', (e) => {
      return this.yScale(e.level)
    })
    .attr('width', this.yScale.bandwidth())
    .attr('height', this.yScale.bandwidth())
    .style('fill', (e) => {
      return this.colors[e.level]
    })
    */

    console.log(d3.extent(data, (d) => { return new Date(d.createdAt) }))
    this.x.domain(d3.extent(data, (d) => { return new Date(d.createdAt) }))
    this.y.domain(['debug', 'info', 'warn', 'error'])
    this.x2.domain(this.x.domain())
    this.y2.domain(this.y.domain())

    this.dots = this.focus.append('g')
    this.dots.selectAll('rect.dot')
        .data(data)
        .enter().append('rect')
        .attr('class', 'dot')
        .attr('x', (d) => {
          return this.x(new Date(d.createdAt))
        })
        .attr('y', (e) => {
          return this.y(e.level)
        })
        .attr('width', this.y.bandwidth())
        .attr('height', this.y.bandwidth())
        .style('fill', (e) => {
          return this.colors[e.level]
        })

    this.dots2 = this.context.append('g')
    this.dots2.selectAll('rect.dot2')
        .data(data)
        .enter().append('rect')
        .attr('class', 'dot2')
        .attr('x', (d) => {
          return this.x2(new Date(d.createdAt))
        })
        .attr('y', (e) => {
          return this.y2(e.level)
        })
        .attr('width', this.y2.bandwidth())
        .attr('height', this.y2.bandwidth())
        .style('fill', (e) => {
          return this.colors[e.level]
        })


/*
    focus.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area);
    */

    this.focus.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(this.xAxis);

    this.focus.append('g')
    .attr('class', 'axis axis--y')
    .call(this.yAxis);

/*
    context.append('path')
    .datum(data)
    .attr('class', 'area')
    .attr('d', area2);
    */

    this.context.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height2 + ')')
    .call(this.xAxis2);

    this.context.append('g')
    .attr('class', 'brush')
    .call(this.brush)
    .call(this.brush.move, this.x.range());

    this.svg.append('rect')
    .attr('class', 'zoom')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .style('fill', 'transparent')
    .call(this.zoom)


/*

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
    */
  }
  zoomed () {
    console.log('zoomed')
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
      console.log('zoom return')
      return // ignore zoom-by-brush
    }
    const t = d3.event.transform
    // gx.call(xaxis.scale(d3.event.transform.rescaleX(this.scale)))
    // this.focus.call(this.xAxis.scale(t.rescaleX(this.x)))
    this.x.domain(t.rescaleX(this.x2).domain())
    // this.focus.select('.area').attr('d', this.area);
    this.focus.select('.axis--x').call(this.xAxis);
    this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));

    this.dots.selectAll('rect.dot')
    .attr('x', (d) => {
      return d3.event.transform.applyX(this.x(new Date(d.createdAt)))
    })
  }
  brushed () {
    console.log('brushed')
    const margin = {top: 20, right: 20, bottom: 110, left: 40}
    const width = 960 - margin.left - margin.right
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
    var s = d3.event.selection || this.x2.range();
    this.x.domain(s.map(this.x2.invert, this.x2));
    this.focus.select('.area').attr('d', this.area);
    this.focus.select('.axis--x').call(this.xAxis);
    this.svg.select('.zoom').call(this.zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));

/*
    debugger
    this.dots.selectAll('rect.dot')
    .attr('x', (d) => {
      return d3.event.transform.applyX(this.x(new Date(d.createdAt)))
    })
    */
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
        <div className={'timeline_chart2'} >
          <svg width='960' height='500'></svg>
        </div>
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
export default connect(mapStateToProps)(withStyles(styles)(Timeline2))
