import React, { Component } from 'react'
import * as d3 from 'd3v3'
class Test extends Component {
  componentDidMount () {
    const w = 1200
    const h = 400
    const parseDate = d3.time.format('%Y-%m-%d').parse
    const flights = ['1988-01-01', '1988-01-02', '1988-01-03',
      '1988-01-04', '1988-01-05', '1988-01-06',
      '1988-01-07', '1988-01-08', '1988-01-09',
      '1988-01-10', '1988-01-11', '1988-01-12',
      '1988-01-13', '1988-01-14', '1988-01-15',
      '1988-01-16', '1988-01-17', '1988-01-18',
      '1988-01-19', '1988-01-20', '1988-01-21',
      '1988-01-22', '1988-01-23', '1988-01-24',
      '1988-01-25', '1988-01-26', '1988-01-27',
      '1988-01-28', '1988-01-29', '1988-01-30',
      '1988-01-31', '1988-02-01', '1988-02-02',
      '1988-02-03', '1988-02-04', '1988-02-05',
      '1988-02-06', '1988-02-07', '1988-02-08',
      '1988-02-09', '1988-02-10', '1988-02-11',
      '1988-02-12', '1988-02-13', '1988-02-14',
      '1988-02-15', '1988-02-16', '1988-02-17',
      '1988-02-18', '1988-02-19', '1988-02-20'].map((d) => { return parseDate(d) })
    this.svg = d3.select('#dd')
      .append('svg')
      .attr('width', w)
      .attr('height', h)

    this.scale = d3.time.scale()
      .domain([flights[0], flights[flights.length - 1]])
      .range([10, w - 110])

    const xaxis = d3.svg.axis().scale(this.scale)
      .orient('bottom')

    const zoom = d3.behavior.zoom()
      .on('zoom', () => {
        this.svg.select('g').call(xaxis).selectAll('text').style('font-size', '10px')
        this.updateEvents()
      }).x(this.scale)
    this.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', w - 100)
      .attr('height', h)
      .attr('opacity', 0)
      .call(zoom)

    this.svg.append('g')
      .attr('class', 'xaxis')
      .call(xaxis)
      .selectAll('text')
      .style('font-size', '10px')

    this.drawEvents(flights)
  }
  drawEvents (dates) {
    const events = this.svg.selectAll('rect.item').data(dates)

    events.enter()
      .append('rect')
      .attr('class', 'item')
      .attr('x', (d) => this.scale(d))
      .attr('y', () => Math.random() * 100)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', 'blue')

    events.exit().remove()
  }
  updateEvents () {
    return this.svg.selectAll('rect.item')
      .attr('x', (d) => this.scale(d))
  }
  render () {
    return (
      <div id='dd' ></div>
    )
  }
}
export default Test
