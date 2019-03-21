function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sampleData) {
    console.log(sampleData);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadata = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sampleData).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key} : ${value}`);
    });
  });
}

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sampleData) {
    var otuIds = sampleData.otu_ids;
    var otuLabels = sampleData.otu_labels;
    var sampleValues = sampleData.sample_values;

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Blackbody'
      }
    };
    var bubbleData = [bubbleTrace];
    var bubbleLayout = {
      xaxis: {
        showlegend: false,
        title: {
          text:'otu id',
          font: {
            size: 20
          }
        }
      }
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, {responsive: true});

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).    
    
    var pieTrace = {
      values: sampleValues.slice(0,10),
      labels: otuIds.slice(0,10),
      hovertext: otuLabels.slice(0,10),
      type: 'pie'
    }

    var pieData = [pieTrace];

    var pieLayout = {
      margin: {
        t: 0, 
        l: 0
      },
      legend: {
        x: 1,
        y: .5
      }
    }  

    Plotly.newPlot('pie', pieData, pieLayout, {responsive: true});
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
