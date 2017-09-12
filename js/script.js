const margin = { top: 90, right: 100, bottom: 70, left: 50 };
const height = 600 - margin.top - margin.bottom, 
			width = 1000 - margin.left - margin.right,
			radius = 5;
const dopingRed = '#f9294a';
const noDoping = ' 	#2a3996';

var svg = d3.select('#chart').append('svg')
	.attr('width', width + margin.left + margin.right)		
	.attr('height', height + margin.top + margin.bottom);

d3.json('cyclist-data.json', function(data){
	const minTime = d3.min(data, d => d.Seconds);
	const xyData = data.map(d => {
		return {X: (d.Seconds-minTime), Y: +d.Place};
	});
	
	const xExtents = d3.extent(xyData, d => d.X);
	const yExtents = d3.extent(xyData, d => d.Y); 
		
	const xScale = d3.scaleLinear()
		.domain([d3.min(xyData, d => d.X),
						 d3.max(xyData, d => d.X) + 10])
		.range([width, 0]);
	const yScale = d3.scaleLinear()
		.domain([d3.min(xyData, d => d.Y),
			       d3.max(xyData, d => d.Y) + 2])
		.range([0, height]);

	var tooltip= d3.select('body').append('div')
	 	.classed('tooltip', true)
	 	.style('position', 'absolute')
	 	.style('padding', '0 10px')
	 	.style('opacity', 0);

	var myGraph = svg.append('g')
		.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
		.selectAll('g.datapoint')
		.data(data) 
		.enter().append('g')
		.attr('class', 'datapoint');
		
	myGraph.append('circle')
		.attr('cx', d => xScale(d.Seconds-minTime))
		.attr('cy', d => yScale(d.Place))
		.attr('r', radius)
		.attr('fill', d => {return d.Doping? dopingRed: noDoping;})
		.on('mouseover', function(d){
				
			tooltip.transition()
				.style('opacity', .9);

			tooltip.html(`<p> ${d.Name}: ${d.Nationality}<br/> 
											Place: ${d.Place}, <br />
											Time: ${d.Time}, <br/>
											Year: ${d.Year}<br/>
											<span>${d.Doping? d.Doping:''}</span></p>`)
		   	.style('left',(d3.event.pageX - 30) + 'px')
		   	.style('top', (d3.event.pageY + 30) + 'px');
		})
		.on('mouseout', function(){
		 	tooltip.text('');
		});

	myGraph.append('text')
		.attr('x', d => { return xScale(d.Seconds - minTime) + 10;})
	 	.attr('y', d => {return yScale(d.Place) + 3;})
	 	.attr('class', 'data-name' )
	 	.text(d => d.Name);

	var xAxisScale = d3.scaleTime()
	 	.domain([new Date((d3.min(xyData, d => d.X))*1000), 
	 					 new Date((d3.max(xyData, d => d.X) + 10)*1000)])
	 	.range([width, 0]);
	
	var yAxisScale = d3.scaleLinear()
	 	.domain([d3.min(xyData, d => d.Y), 
	 					(d3.max(xyData, d => d.Y) + 2)])
	 	.range([0, height]);
	
	var yAxis = d3.axisLeft(yAxisScale);
	var xAxis = d3.axisBottom(xAxisScale);

	yAxis.ticks(7);
	xAxis.ticks(7, "%M:%S");

	svg.append('g')
	 	.attr('transform', 'translate('+margin.left+','+margin.top+')')
	 	.call(yAxis);
	svg.append('g')
 		.attr('transform', 
 			'translate('+margin.left+', '+(height+margin.top)+')')
 		.call(xAxis);


 	var graphTitle =  svg.append('g')
 		.attr('class', 'graph-title');

 	graphTitle.append('text')	
	  .attr('x', 340)
	 	.attr('y', 30)
	 	.attr('class', 'chart-name')
	 	.text("Doping in Professional Bicycle Racing");
 	graphTitle.append('text')	
	  .attr('x', 380)
	 	.attr('y', 60)
	 	.attr('class', 'chart-extra')
	 	.text("35 Fastest Times up Alpe d'Huez");
	graphTitle.append('text')
	 	.attr('x', 420)
	 	.attr('y', 85)
	 	.attr('class', 'span')
	 	.text("Normalized to 13.8 km distance");	 

	d3.select('svg').append('text')
		.attr('x', 70)
	 	.attr('y', 150)
	 	.attr('class', 'axis-title')
	 	.text('Ranking')
	 	.attr('transform', 'rotate(270, 70, 150)');

	d3.select('svg').append('text')
	 	.attr('x', 410)
	 	.attr('y', 580)
	 	.attr('class', 'axis-title')
	 	.text('Minutes Behind Fastest Time');

	//legend
	var legend = svg.append('g')
		.attr('class', 'legend')
		
	legend.append('circle')
		.attr('cx', (width - 50))
		.attr('cy', (height/1.5 +10))
		.attr('r', radius)
		.attr('fill', dopingRed);
	legend.append('circle')
		.attr('cx', (width - 50))
		.attr('cy', (height/1.5 + 40))
		.attr('r', radius)
		.attr('fill', noDoping);

	legend.append('text')
		.attr('x', (width - 40))
		.attr('y', (height/1.5 +13))
		.attr('class', 'legend-text')
		.text('Riders with doping allegations');	

	legend.append('text')
		.attr('x', (width - 40))
		.attr('y', (height/1.5 +43))
		.attr('class', 'legend-text')
		.text('No doping allegations');	
});