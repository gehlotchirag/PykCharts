PykCharts.BubblePack = function (options) {

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

var diameter = 600,
    format = d3.format(",d"),
    color = d3.scale.category20c();
 

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select(options.selection).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

	var CircleScale = d3.scale.linear()
                           .domain([0,10000])
                           .range([0,diameter]);

						   
d3.json(options.data, function(error, root) {
  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
 
 node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
	  				.on("mouseover", function(d){return that.tooltip.html(d.tip).style("visibility", "visible");})
	  			//	.on("mouseover", function(d){return   console.log("tooltip:" + d.tip);})

				.on("mousemove", function(){return that.tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

				.on("mouseout", function(){return that.tooltip.style("visibility", "hidden");})

      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else
{
	console.log("className:" + node);
    console.log("ttip:" + node.ttip);
	console.log("color:" + node.colors);

	classes.push({packageName: name, className: node.name, value: node.size, tip:node.ttip, color:node.colors});
 } 
  }

  recurse(null, root);
  console.log("classes:" + classes.ttip);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");

}


}

