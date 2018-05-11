import axios from 'axios';
import * as d3 from 'd3';

/* global $ */

export function targetAndRemoveStock(target, socket) {
    return (dispatch) => {
        dispatch({type: 'REMOVING_STOCK', symbol: target, socket: socket});
    };
}

export function queryAndAddStock(preexisting, query, start, end, socket) {
    return (dispatch) => {
        dispatch({type: 'QUERYING_STOCK_START'});
        
        axios.get('/barchart?start=' + start + '&end=' + end + '&query=' + query)
        .then((response) => {
            const stockSymbols = response.data.results != null ? preexisting.map(stock => stock.results[0].symbol.toUpperCase()) : [];
            
            if (response == false) {
                dispatch({type: 'QUERYING_STOCK_ERROR', error: 'Stock ' + query + ' unavailable'});
            }
            else if (response.data.results == null) {
                dispatch({type: 'QUERYING_STOCK_ERROR', error: 'Stock ' + query + ' was not found'});
            }
            else if (response.data.results != null && stockSymbols.includes(response.data.results[0].symbol.toUpperCase()) != true) {
                dispatch({type: 'QUERYING_STOCK_FULFILLED'});
                dispatch({type: 'ADDING_STOCK', stock: response.data, socket: socket});
            }
            else {
                dispatch({type: 'QUERYING_STOCK_ERROR', error: 'Stock ' + query + ' is already listed'});
            }
        })
        .catch((error) => {
            console.error(error);
            
            dispatch({type: 'QUERYING_STOCK_ERROR', error: error});
        });
    };
}

export function visualizeStocks(node, stocks) {
    return (dispatch) => {
        const width = $('#master-container').width();
        const height = 400;
        const margin = {top: 20, right: 40, bottom: 85, left: 50};
        
        stocks = JSON.parse(JSON.stringify(stocks));
        
        stocks = stocks.filter(ele => ele != null);
        
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        
        const graph = d3.select(node)
                .attr('width', width)
                .attr('height', height)
            .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        const x = d3.scaleTime() // Time -> Band
                .rangeRound([0, width - (margin.right * 2)]);
        const y = d3.scaleLinear()
                .rangeRound([height - margin.bottom, 0]);
                
        const yGridlines = d3.axisLeft()
                .ticks(10)
                .tickSize(-(width - (margin.right * 2)))
                .scale(y)
                .tickFormat('');
        
        const xTicks = ((width) => {
            if (width <= 600)
                return 10;
            else
                return 20;
        })($(window).width());
            
        const xAxis = d3.axisBottom()
                .ticks(xTicks)
                .scale(x)
                .tickFormat(d3.timeFormat('%Y-%m-%d'));
        const yAxis = d3.axisLeft()
                .ticks(10)
                .scale(y)
                .tickFormat((d) => { return '$' + d; });
                
        const parseTime = d3.timeParse('%Y-%m-%d');
                
        const line = d3.line()
                .x((d) => { return x(d.date); })
                .y((d) => { return y(d.price); });
        
        if (stocks.length > 0) {
            let dates = stocks.reduce((master, stock) => { return master.concat(stock.results.reduce((accum, curr) => { 
                accum.push(curr.tradingDay); 
                return accum; 
            }, [])); }, []).sort((a, b) => { 
                const one = new Date(a);
                const two = new Date(b);
                
                if (one < two) {
                    return -1;
                }
                else if (one > two) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            // resume currying
            dates = dates.filter((element, i) => {
                if (element == dates[i + 1]) {
                    return false;
                }
                else {
                    return true;
                }
            }).map((element) => { return new Date(element); });
            
            x.domain(d3.extent(dates, (date) => { return date; }));
            y.domain([0, d3.max(stocks, (i) => { return i.results.reduce((biggest, curr) => Math.max(biggest, +curr.close), 0); })]);
        }
        else {
            x.domain(d3.extent([], () => { return null; }));
            y.domain([0, 100]);
        }
        
        graph.append("g")
                .attr("class", "grid")
                .attr('stroke-dasharray', '2,2')
                .call(yGridlines);
        
        stocks.forEach((element, index) => {
            const indexData = element.results.map(i => ({date: parseTime(i.tradingDay), price: +i.close}));
            
            graph.append('path')
                    .datum(indexData)
                    .attr('class', 'line')
                    .attr('id', 'line' + index)
                    .attr('fill', 'none')
                    .attr('stroke', stocks[index].color)
                    .attr('stroke-linejoin', 'round')
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', 1.5)
                    .attr('d', line)
                    .attr('stroke-dasharray', function() {
                        return d3.select(this).node().getTotalLength() + ' ' + d3.select(this).node().getTotalLength();
                    })
                    .attr('stroke-dashoffset', function() { 
                        return d3.select(this).node().getTotalLength();
                    })
                    .transition()
                        .duration(750)
                        .ease(d3.easeLinear)
                        .attr('stroke-dashoffset', 0);
        });
        
        // the idea behind this code block comes from...
        // https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
        
        const paths = document.getElementsByClassName('line');
        
        const mouseG = graph.append('g')
                .style('width', '100%')
                .style('margin', 'auto 0')
                .attr('class', 'mouse-over-effects');
                    
        mouseG.append('path')
                .attr('class', 'mouse-line')
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', '1px')
                .style('opacity', '0')
                .style('width', '100%')
                .style('margin', 'auto 0');
    
        const mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(stocks)
            .enter().append('g')
                .style('width', '100%')
                .style('margin', 'auto 0')
                .attr('id', (d, i) => { return 'mouse-per-line' + i; })
                .attr('class', 'mouse-per-line');
            
        mousePerLine.append('circle')
                .attr('id', (d, i) => { return 'stock-marker' + i; })
                .attr('r', 7)
                .attr('stroke', (d) => { return d.color; })
                .attr('fill', 'none')
                .attr('stroke-width', '1px')
                .style('opacity', '0');
        
        // disabled        
        // mousePerLine.append('text')
        //         .attr('id', (d, i) => { return 'stock-label' + i; })
        //         .attr('transform', 'translate(10, -10)');
                
        mousePerLine.append('text')
                .attr('fill', (d, i) => { return d.color; })
                .attr('id', (d, i) => { return 'date-label' + i; })
                .attr('transform', 'translate(10,-8)');
                    
        mousePerLine.append('text')
                .attr('fill', (d, i) => { return d.color; })
                .attr('id', (d, i) => { return 'price-amount' + i; })
                .attr('transform', 'translate(-70,-8)');
           
        mouseG.selectAll('rect')
                .data(stocks)
            .enter().append('rect')
                .attr('id', (d, i) => { return 'rect' + i; })
                .attr('x', (d, i) => { return paths[i].getBBox().x; })
                .attr('width', (d, i) => { return (width - (margin.right * 2)) - (paths[i].getBBox().x); })  // right here, box bounding
                .attr('height', height - margin.bottom)       
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseout', (d, i) => {
                    d3.select('.mouse-line')
                            .style('opacity', '0');
                })
                .on('mouseover', (d, i) => {
                    d3.select('.mouse-line')
                            .style('opacity', '1');
                })
                .on('mousemove', function(d, i) {
                    const mouse = d3.mouse(this);
                        
                    d3.select('.mouse-line')
                            .attr('d', (d) => {
                                return 'M' + mouse[0] + ',' + (height - margin.bottom) + ' ' + mouse[0] + ',' + 0;
                            });
                });
        
        stocks.forEach((ele, i) => {
            // offset discontinuity
            const mainOffset = $('.grid').offset();
            
            const element = $('#rect' + i),
                theOff = element.offset(),
                theWidth = element.width(),
                theHeight = element.height();
            
            $(document).mousemove(function(event) {
                let mouse = [];
                mouse.push(event.pageX);
                mouse.push(event.pageY);
                
                if (mouse[0] > theOff.left && mouse[0] < (theWidth + theOff.left) && mouse[1] > theOff.top && mouse[1] < (theHeight + theOff.top)) {
                    d3.selectAll('#mouse-per-line' + i + ' circle')
                            .style('opacity', '1');
                    d3.selectAll('#mouse-per-line' + i + ' text')
                            .style('opacity', '1');
                }
                else {
                    d3.selectAll('#mouse-per-line' + i + ' circle')
                            .style('opacity', '0');
                    d3.selectAll('#mouse-per-line' + i + ' text')
                            .style('opacity', '0');
                }
                
                d3.select('#mouse-per-line' + i)
                        .attr('transform', function() {
                            const xDate = x.invert(mouse[0] - (mainOffset.left - 0)),
                                bisect = d3.bisector((d) => { return parseTime(d.date); }).left,
                                idx = bisect(stocks[i].results, xDate);
                                    
                            const pathEl = paths[i],
                                pathLength = pathEl.getTotalLength();
                                    
                            let beginning = 0, 
                                end = pathLength,
                                target = null,
                                pos = null;
                                        
                            while (true) {
                                target = Math.floor((beginning + end) / 2);
                                pos = pathEl.getPointAtLength(target);
                                        
                                if ((target === end || target === beginning) && pos.x !== x) {
                                    break;
                                }
                                    
                                if (pos.x > (mouse[0] - (mainOffset.left - 0))) {
                                    end = target;
                                }
                                else if (pos.x < (mouse[0] - (mainOffset.left + 0))) {
                                    beginning = target;
                                }
                                else {
                                    break;
                                }
                            }
                            
                            // disabled
                            // d3.select(this).select('#stock-label' + i)
                            //         .text(stocks[i].results[0].symbol);
                                    
                            d3.select(this).select('#date-label' + i)
                                    .text(x.invert(pos.x).getFullYear() + '-' + (x.invert(pos.x).getMonth() + 1) + '-' + x.invert(pos.x).getDate());
                                    
                            d3.select(this).select('#price-amount' + i)
                                    .text('$' + y.invert(pos.y).toFixed(2));
                                            
                            return 'translate(' + (mouse[0] - (mainOffset.left + 0)) + ',' + pos.y + ')';
                        });
            });
        });
        
        graph.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
                .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .style("font-weight", "bold")
                .attr("dx", "-.8em")
                .attr("dy", "-.2em")
                .attr("transform", (d) => { return "rotate(-65)"; });
        graph.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
    };
}

export function updateStore(stocks) {
    return (dispatch) => {
        dispatch({type: 'UPDATING_STOCKS', stocks: stocks});
    };
}