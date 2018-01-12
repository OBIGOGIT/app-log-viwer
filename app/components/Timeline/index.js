import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import {connect} from 'react-redux'
import * as logActions from '../../actions/log'
import {bindActionCreators} from 'redux'
import axios from 'axios'
import moment from 'moment'
import * as d3 from 'd3v4'
import {colors} from '../../libs/const'
const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class Timeline extends Component {
  constructor () {
    super()
    this.state = {
      width: 0
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
    this.removeExistChart = this.removeExistChart.bind(this)
    this.drawFocusedChart = this.drawFocusedChart.bind(this)
    this.drawBrushChart = this.drawBrushChart.bind(this)
    this.initLayout = this.initLayout.bind(this)
  }
  removeExistChart () {
    d3.select('.timeline_chart > svg').remove()
  }
  initLayout (data) {
    this.margin = {top: 20, right: 10, bottom: 130, left: 40}
    this.margin2 = {top: 270, right: 10, bottom: 30, left: 40}

    this.width = 1100 - this.margin.left - this.margin.right
    this.height = 340 - this.margin.top - this.margin.bottom
    this.height2 = 340 - this.margin2.top - this.margin2.bottom

    this.startDate = this.timeParse(moment(data[data.length - 1].createdAt).add('day', -1).format('YYYY-MM-DD HH:mm:ss.SSS'))
    this.endDate = this.timeParse(moment(data[0].createdAt).add('day', 1).format('YYYY-MM-DD HH:mm:ss.SSS'))

    this.svg = d3.select('.timeline_chart').append('svg')
    this.svg.attr('width', 1100)
    this.svg.attr('height', 340)

    this.rectWidthScale = d3.scaleLog().domain([1, 1000]).range([0.1, 1])
  }
  drawFocusedChart (data) {
    this.focus = this.svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

    this.focusXScale = d3.scaleTime()
    this.focusXScale.domain([this.startDate, this.endDate]).range([0, this.width])

    this.focusYScale = d3.scaleBand().domain(['debug', 'info', 'warn', 'error']).rangeRound([0, this.height]).padding(0.2)
    this.focusXAxis = d3.axisBottom(this.focusXScale)

    const focusYAxis = d3.axisLeft(this.focusYScale)
    this.foucsXGroup = this.focus.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(this.focusXAxis)

    this.zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [this.width, this.height]])
    .extent([[0, 0], [this.width, this.height]])
    .on('zoom', () => {
      this.updateEvents()
    })

    this.svg.append('rect')
    .attr('class', 'zoom')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
    .style('fill', 'transparent')
    .call(this.zoom)

    this.drawEvents(data)

    const focusYGroup = this.focus.append('g')
    // 오버레이 방지용 rect생성
    focusYGroup.append('g').append('rect').attr('height', this.height).attr('width', this.margin.left).style('fill', '#ffffff').attr('transform', 'translate(' + (-this.margin.left) + ',0)')
    focusYGroup.append('g').attr('class', 'axis axis--y').call(focusYAxis)
  }
  drawBrushChart (data) {
    this.context = this.svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')')

    this.brush = d3.brushX()
    .extent([[0, 0], [this.width, this.height2]])
    .on('brush end', this.brushed)

    this.contextXScale = d3.scaleTime().range([0, this.width]).domain(this.focusXScale.domain())
    this.contextYScale = d3.scaleBand().rangeRound([0, this.height2]).padding(0.2).domain(this.focusYScale.domain())

    const contextXAxis = d3.axisBottom(this.contextXScale)

    this.context.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + this.height2 + ')')
    .call(contextXAxis)

    const brush = this.context.append('g')
    .attr('class', 'brush')
    .call(this.brush)
    .call(this.brush.move, this.focusXScale.range())
    brush.selectAll('rect.handle').style('fill', '#888888')
    this.drawBrushItems(data)
  }
  drawChart () {
    const data = this.props.log.logs
    if (data.length === 0) {
      return
    }
    this.removeExistChart()
    this.initLayout(data)
    this.drawFocusedChart(data)
    this.drawBrushChart(data)
  }
  updateEvents () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
      return // ignore zoom-by-brush
    }

    const t = d3.event.transform
    this.focusXScale.domain([this.startDate, this.endDate])
    this.foucsXGroup.call(this.focusXAxis.scale(d3.event.transform.rescaleX(this.focusXScale)))
    this.focus.select('.xaxis').call(this.focusXAxis)

    this.context.select('.brush').call(this.brush.move, this.focusXScale.range().map(t.invertX, t))

    return this.focus.selectAll('circle.item')
    // .attr('width', (d) => this.rectWidthScale(t.k) * this.focusYScale.bandwidth())
    .attr('r', (d) => 10)
    .attr('cx', (d) => d3.event.transform.applyX(this.focusXScale(this.timeParse(d.createdAt))))
  }
  brushed () {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return // ignore brush-by-zoom

    var s = d3.event.selection || this.contextXScale.range()

    this.focusXScale.domain(s.map(this.contextXScale.invert, this.contextXScale))
    this.foucsXGroup.call(this.focusXAxis.scale(this.focusXScale))
    this.focus.select('.xaxis').call(this.focusXAxis)
    this.focus.selectAll('circle.item')
    .attr('cx', (d) => this.focusXScale(this.timeParse(d.createdAt)))
    this.svg.select('.zoom')
    .call(this.zoom.transform,
    d3.zoomIdentity
        .scale(this.width / (s[1] - s[0]))
        .translate(-s[0], 0))
  }
  drawBrushItems (data) {
    const dots = this.context.selectAll('rect.item').data(data)
    dots.enter()
    .append('rect')
    .attr('class', 'item')
    .attr('x', (d) => this.contextXScale(this.timeParse(d.createdAt)))
    .attr('y', (e) => this.contextYScale(e.level))
    .attr('width', 1)
    .attr('height', this.contextYScale.bandwidth())
    .style('fill', (e) => colors[e.level])

    dots.exit().remove()
  }
  drawEvents (data) {
    const dots = this.focus.selectAll('circle.item').data(data)
    dots.enter()
    .append('circle')
    .attr('class', 'item')
    .attr('cx', (e) => this.focusXScale(this.timeParse(e.createdAt)))
    .attr('cy', (e) => this.focusYScale(e.level) + (this.focusYScale.bandwidth() / 2))
    .attr('r', () => 10)
    .style('fill', (e) => colors[e.level])

    dots.exit().remove()
  }
  componentDidMount () {
    const {code, version} = this.props
    axios.get(`http://210.216.54.100:3000/api/log/logTime?code=${code}&version=${version}`)
    .then((r) => {
      this.props.setLogs(r.data)
    })
  }
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root} ref='chartContainer'>
        <div className={'timeline_chart'} >
          {this.drawChart()}
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
function mapDispatchToProps (dispatch) {
  return bindActionCreators({...logActions}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Timeline))
