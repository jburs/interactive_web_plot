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
  })
  // generate inital plots (to do: remove hard coded number)
  buildMetadata(940);
  buildCharts(940);
}


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}


function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
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

function buildCharts(sample){
  // get top bacterial species data for sample, generate secind var for top 10 in each 
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var samplearray = samples.filter(sampleObj => sampleObj.id == sample);
    var sampleValues = samplearray[0].sample_values;
    var sampleValuesTen = sampleValues.slice(0,10).reverse();
    var sampleOtuIds = samplearray[0].otu_ids;
    var sampleOtuIdsTen = sampleOtuIds.slice(0,10).reverse();
    // convert sampleOtuIdsTen from array of int, to array of string
    var sampleOtuIdsTenStr = sampleOtuIdsTen.map(element => element.toString());
    var sampleOtuLabels = samplearray[0].otu_labels;
    var sampleOtuLabelsTen = sampleOtuLabels.slice(0,10).reverse();
    //get washing frequency
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var washingFreq = metaArray[0].wfreq;


    // generate horizontal bar chart
    var traceBar = {
      x: sampleValuesTen,
      y: sampleOtuIdsTenStr,
      text: sampleOtuLabelsTen,
      name: "Value Count",
      type: "bar",
      orientation: "h"
    };
    // data for bar plot
    var dataBar = [traceBar];
    // bar plot Layout info
    var layoutBar = {
      title: "Top 10 Bacterial Species",
      yaxis: {title: "OUT ID", type: 'category'},
      xaxis: {title: "Count"},
      font: {color: 'black', size: 16},
      plot_bgcolor: "rgb(184, 79, 79)",
      paper_bgcolor:"rgb(184, 79, 79)",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
      
    };
    // generate bar plot
    Plotly.newPlot("bar", dataBar, layoutBar);


    // create bubble chart
    // get good sizes for the bubbles
    var bubbleSize = sampleValues.map(element => element/2);
    // data for bubble plot
    var traceBubble = {
      x: sampleOtuIds,
      y: sampleValues,
      text: sampleOtuLabels,
      mode: 'markers',
      marker:{
        colorscale: 'Portland',
        color: sampleOtuIds,
        line: {color: 'black'},
        size: bubbleSize
      }
    }
    // data for bubble plot
    databubble = [traceBubble]
    // layout for bubble plot
    var layoutBubble = {
      title: "frequency of OTU's",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "count"},
      font: {color: 'black', size: 16},
      plot_bgcolor: "rgb(184, 79, 79)",
      paper_bgcolor:"rgb(184, 79, 79)",
      showlegend: false,
    }
    // generate bubble plot
    Plotly.newPlot("bubble", databubble, layoutBubble);


    // Gauge chart
    var traceGauge = {
      value: washingFreq,
      title: { text: "Washing Frequency" },
      type: "indicator",
      gauge: {
        bar: { color: "rgb(108, 72, 119)"},
        bgcolor: "rgb(71, 138, 168)",
        bordercolor: "rgb(108, 72, 119)",
        boarderwidth: 3,
        axis: { visible: true, range: [0, 9], tickmode:"linear", ticks:"inside" } 
      },
      mode: "gauge+number",

    }
    // Gauge data and layout
    dataGauge = [traceGauge]
    var layoutGauge = {
      font: {color: 'black', size: 16},
      plot_bgcolor: "rgb(184, 79, 79)",
      paper_bgcolor:"rgb(184, 79, 79)",
    }

    Plotly.newPlot("gauge", dataGauge, layoutGauge)

    });





}


// calls initializer function
init();

