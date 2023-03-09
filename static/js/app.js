const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let names;
let jsonData;

// Fetch the JSON data and assign it to variables
d3.json(url).then(function (data) {
  names = data.names;
  jsonData = data.samples;

  //Create Dropdown Menu from the Names array
  let dropdownMenu = d3.select("#selDataset");
  data.names.forEach((name) => {
    dropdownMenu.append("option").text(name).property("value", name);
  });

  d3.select("#selDataset").on("change", optionChanged);

  //Select Corresponding Data from the dropdown menu
  function updateData(sample) {
    let variable = d3.select("#selDataset").property("value");

    let metadata = data.metadata.filter(
      (meta) => meta.id.toString() === sample
    )[0];
    console.log(metadata);

    //Add metadata key and value to the panel
    let panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

    let filteredData = jsonData.filter((sample) => sample.id === variable);
    let sortedData = filteredData.sort(
      (a, b) => b.sample_values - a.sample_values
    );
    let slicedData = sortedData.slice(0, 10);
    let reversedData = slicedData.reverse();

    console.log(reversedData);

    // Assign variables to hold bar axis data
    let barsample_data = reversedData.map((row) => row.sample_values)[0].slice(0, 10);
    let barotu_data = reversedData.map((row) =>  row.otu_ids)[0].slice(0, 10);
    let barotu_label_data = reversedData.map((row) => row.otu_labels)[0].slice(0, 10);
    let yticks = barotu_data.slice(0,10).map(otuid => `OTU ${otuid}`).reverse()
    
    const trace1data = barsample_data.sort((a,b) => a-b)

    // Update Bar Chart
    let trace1 = [
      {
        x: trace1data,
        y: yticks,
        hovertext: barotu_label_data,
        type: "bar",
        orientation: "h",
      },
    ];


    Plotly.newPlot("bar", trace1);

    // Assign variables to hold bubble axis data
    let bubblesample_data = reversedData.map((row) => row.sample_values)[0];
    let bubbleotu_data = reversedData.map((row) =>  row.otu_ids)[0];
    let bubbleotu_label_data = reversedData.map((row) => row.otu_labels)[0];
    
    // Update Bubble Chart
    let trace2 = [
      {
        x: bubbleotu_data,
        y: bubblesample_data,
        text: bubbleotu_label_data,
        mode: "markers",
        marker: {
          size: bubblesample_data,
          color: bubbleotu_data,
          colorscale: "Earth",
        },
      },
    ];

    let layout = {
      xaxis : {
        title: "OTU ID"
      }
    }

    Plotly.newPlot("bubble", trace2, layout);
  }

  // Update the value based on the dropdown menu
  function optionChanged() {
    let sample = d3.select("#selDataset").property("value");

    updateData(sample);
  }

  // Call updateData with the default sample
  updateData(names[0]);
});
