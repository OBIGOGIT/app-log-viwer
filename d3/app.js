(function(){
  var flights = ['1988-01-01', '1988-01-02', '1988-01-03',
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
    '1988-02-18', '1988-02-19', '1988-02-20']


  var svg = d3.select('#app').append('svg')
  svg.attr('width', 1200)
  svg.attr('height', 300)



  var scale = d3.scaleTime()
  scale.domain([new Date(flights[0]), new Date()])
  .range([0, 1200])


  var xaxis = d3.axisBottom(scale)
  // xaxis.tickFormat(d3.timeFormat("%B %d, %Y"))

  // .tickFormat(d3.timeFormat('%m/%d'))

  var gx = svg.append('g')
  .attr('class', 'xaxis')
  .call(xaxis)

  var zoom = d3.zoom()
    .on('zoom', () => {
      // svg.select('g').call(xaxis).selectAll('text').style('font-size', '10px')
      gx.call(xaxis.scale(d3.event.transform.rescaleX(scale)))
      updateEvents()
    })
  zoom.scaleTo(svg, 200)
  svg.call(zoom)
  drawEvents(flights)

  function drawEvents (dates) {
    const events = svg.selectAll('rect.item').data(dates)
    events.enter()
      .append('rect')
      .attr('class', 'item')
      .attr('x', (d) => { 
        return scale(new Date(d))
      })
      .attr('y', () => Math.random() * 100)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', 'blue')

    events.exit().remove()
  }
  function updateEvents () {
    return svg.selectAll('rect.item')

    // ircles.attr('cx', function(d) { return transform.applyX(xScale(d)); });
    //
      .attr('x', (d) => {
        return d3.event.transform.applyX(scale(new Date(d)))
      })
  }

})()

