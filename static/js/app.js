// Assign URL to Variable
const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and assign it to variables
d3.json(url).then(function (data) {
  let jsonNames = data.names;
  let jsonSample = data.samples;
  let dropdownMenu = d3.select("#selDataset");

  //Create Dropdown Menu from the Names array
  jsonNames.forEach((name) =>
    dropdownMenu.append("option").text(name).property("value", name)
  );

  // Create Function to select item from dropdown menu
  function optionChanged() {
    let sample = d3.select("#selDataset").property("value");
    updateAllData(sample);
  }

  //Allow Dropdown Menu to update items on dashboard
  d3.select("#selDataset").on("change", optionChanged);

  //Create Function to update each visual on the dashboard
  function updateAllData(sample) {
    let jsonValue = d3.select("#selDataset").property("value");
    let metadata = data.metadata.filter(
      (meta) => meta.id.toString() === sample
    )[0];

    //Update the Metadata Panel with the selected key and value
    let panel = d3.select("#sample-metadata").html("");
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

    // Transform Initial json Data
    let filteredData = jsonSample.filter((sample) => sample.id === jsonValue);
    let sortedData = filteredData.sort(
      (a, b) => b.sample_values - a.sample_values
    );
    
    // Assign variables to hold bar axis data
    let barsample_data = sortedData
      .map((row) => row.sample_values)[0]
      .slice(0, 10);
    let barotu_data = sortedData.map((row) => row.otu_ids)[0].slice(0, 10);
    let barotu_label_data = sortedData
      .map((row) => row.otu_labels)[0]
      .slice(0, 10);
    let yticks = barotu_data
      .slice(0, 10)
      .map((otuid) => `OTU ${otuid}`)
      .reverse();
    const trace1data = barsample_data.sort((a, b) => a - b);

    // Assign variables to hold bubble axis data
    let bubblesample_data = sortedData.map((row) => row.sample_values)[0];
    let bubbleotu_data = sortedData.map((row) => row.otu_ids)[0];
    let bubbleotu_label_data = sortedData.map((row) => row.otu_labels)[0];

    // Create Bar Chart with Selected Data
    let trace1 = [
      {
        x: trace1data,
        y: yticks,
        hovertext: barotu_label_data,
        type: "bar",
        orientation: "h",
      },
    ];

    // Draw Updated Bar Chart
    Plotly.newPlot("bar", trace1);

    // Create Bubble Chart with Selected Data
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
    let layout = { xaxis: { title: "OTU ID" } };

    // Draw Updated Bubble Chart
    Plotly.newPlot("bubble", trace2, layout);
  }

  // Use UpdateAllData Function to set default values as page loads
  updateAllData(jsonNames[0]);
});
