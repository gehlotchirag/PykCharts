PykCharts.treerect = function (options) {


this.init = function(){
		var that = this;

	d3.json(options.data, function(e, data){
	//  var max = that.render.classes(data);
	//  alert(max);
	    that.data = data;
	    that.render();
			    that.renderTooltip();

	});
    }
	
	 this.renderTooltip = function(){
	
		$("#pyk-bubble-tooltip").remove();
	     this.tooltip = d3.select("body")
	    .append("div").attr("id","pyk-bubble-tooltip")
	    .style("position", "absolute")
	    .style("z-index", "10")
	    .style("visibility", "hidden")
	    .style("background", "#fff")
	    .style("padding", "10px 20px")
	    .style("box-shadow", "0 0 10px #000")
	    .style("border-radius", "5px")
	    .text("a simple tooltip");

    }

		 this.render = function()
	 {
	var that = this;


var w = 960 - 60,
    h = 600 - 135,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([0, h]),
    color = d3.scale.category20c(),
    root,
    node;

var treemap = d3.layout.treemap()
    .round(false)
    .size([w, h])
    .sticky(true)
    .value(function(d) { return d.size; });

var svg = d3.select(options.selection).append("div")
    .attr("class", "chart")
    .style("width", w + "px")
    .style("height", h + "px")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(.5,.5)");

d3.json(options.data, function(data) {
  node = root = data;

  var nodes = treemap.nodes(root)
      .filter(function(d) { return !d.children; });

  var cell = svg.selectAll("g")
      .data(nodes)
    .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  cell.append("svg:rect")
      .attr("width", function(d) { return d.dx - 1; })
      .attr("height", function(d) { return d.dy - 1; })
	  	  		
		.on("mouseover", function(d){return that.tooltip.html(d.ttip).style("visibility", "visible");})
	  			//	.on("mouseover", function(d){return   console.log("tooltip:" + d.tip);})

		.on("mousemove", function(){return that.tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

		.on("mouseout", function(){return that.tooltip.style("visibility", "hidden");})

      .style("fill", function(d) { return color(d.parent.name); });

	  
	  cell.append("image")
    //.attr("xlink:href", "http://www.pykih.com/favicon.ico")
	.attr("xlink:href", function(d) { return d.img; })
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 16)
    .attr("height", 16);

	
	
  cell.append("svg:text")
      .attr("x", function(d) { return d.dx / 2; })
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
	  .attr("fill", "white")
      .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

});

function size(d) {
  return d.size;
}

function count(d) {
  return 1;
}

}

}
