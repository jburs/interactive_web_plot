function init() {
    // select dropdown menu
    var selector = d3.select("#selDataset");
  
    // read data from JSON file, entirety assigned to data
    d3.json("samples.json").then((data) => {
      console.log(data);
      // array of numbers for the names
      var sampleNames = data.names;
      //  For each element in the array, a dropdown menu option is appended
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}


function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray)
    var result = resultArray[0];
    // he d3.select() method is used to select this <div>, and the variable PANEL is assigned to it.
    var PANEL = d3.select("#sample-metadata");
    // ensures that the contents of the panel are cleared when another ID number is chosen from the dropdown menu.
    PANEL.html("");
    // append a H6 heading to the panel and print the location of the volunteer to the panel, respectively.
    info = Object.entries(result);
    for (i=0; i<info.length; i++) {
      PANEL.append("h6").append("b").text(info[i][0] + ":" + info[i][1]);
    }
    
  });
}

// calls initializer function
init();

