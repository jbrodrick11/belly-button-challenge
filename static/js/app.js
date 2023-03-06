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

    // Assign variables to hold axis data
    let sample_data = reversedData.map((row) => row.sample_values)[0].slice(0, 10);
    let otu_data = reversedData.map((row) =>  row.otu_ids)[0].toString().slice(0, 10);
    let otu_label_data = reversedData.map((row) => row.otu_labels)[0].slice(0, 10);
    
    // Update Bar Chart
    let trace1 = [
      {
        x: sample_data,
        y: otu_data,
        hovertext: otu_label_data,
        type: "bar",
        orientation: "h",
      },
    ];


    Plotly.newPlot("bar", trace1);

    // Update Bubble Chart
    let trace2 = [
      {
        x: otu_data.slice(0, 10),
        y: sample_data.slice(0, 10),
        text: otu_label_data.slice(0, 10),
        mode: "markers",
        marker: {
          size: sample_data.slice(0, 10),
          color: otu_data.slice(0, 10),
          colorscale: "Earth",
        },
      },
    ];

    Plotly.newPlot("bubble", trace2);
  }

  // Update the value based on the dropdown menu
  function optionChanged() {
    let sample = d3.select("#selDataset").property("value");

    updateData(sample);
  }

  // Call updateData with the default sample
  updateData(names[0]);
});
