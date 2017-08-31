var svg = d3.select("svg");
var omega = 0.1;
var k = 0.08;

svg.on("click", function() {
   scramble();
})

var n = 100;
var data = new Float32Array(n);


var color = d3.scaleOrdinal(d3.schemeCategory10);


for(var i = 0; i < n; i++){
    data[i] = Math.random()*2*Math.PI;
}

function getX(i) {
    return 300 - (0.2 + Math.random())*600*Math.cos(i);
}

function getY(i) {
    return 300 - (0.2 + Math.random())*600*Math.sin(i);
}

function drawNodes() {

    // DATA JOIN
    // Join new data with old elements, if any.
    var nodes = svg.selectAll("circle")
                 .data(data);

    // UPDATE
    // Update old elements as needed.
    nodes.attr("class", "update");

    // ENTER
    // Create new elements as needed.
    //
    // ENTER + UPDATE
    // After merging the entered elements with the update selection,
    // apply operations to both.
    nodes.enter()
     .append("circle")
         .attr("class", "enter")
         .style("stroke", "#000")
         .style("stroke-width",  "1.5px")
     .merge(nodes)
         .transition()
         .duration(100)
         .style("stroke", "gray")
         .style("fill", function(d, i) { return color(i); })
         .attr("cx", function(d, i) { return getX(d); })
         .attr("cy", function(d, i) { return getY(d); })
         .attr("r", 10);

    // EXIT
    // Remove old elements as needed.
    nodes.exit().remove();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scramble() {
    k = -k;
    await sleep(5000);
    k = -k;
}

d3.interval(function() {
      var avg = [0.0, 0.0];
      var psi = 0;
      for(var i = 0; i < data.length; i++){
        avg[0] = avg[0] + Math.cos(data[i]);
        avg[1] = avg[1] + Math.sin(data[i]);
        psi = psi + data[i];
      }
      avg[0] = avg[0]/data.length;
      avg[1] = avg[1]/data.length;
      psi = psi /data.length;
      var r = Math.sqrt(Math.pow(avg[0],2) + Math.pow(avg[1],2));
      for(var i = 0; i < data.length; i++){
        data[i] = (data[i] + omega*Math.random() + k*Math.random()*r*Math.sin(psi - data[i])) % (2*Math.PI);
      }
      drawNodes();

    }, 10);


svg.append("text").text("Click to scramble.").attr("x", 50).attr("y", 50).style("fill", "green");


