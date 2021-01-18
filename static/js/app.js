function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }

function chart(sample) {
    d3.json("../../data/samples.json").then(data=> {
        console.log(data)

        //Filter sample by chosen ID
        var samples = data.samples.filter(s => s.id.toString() === sample)[0]

        //Filter sample chosen for top ten
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
    
        // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU: " + d)

        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);

        //Bar Chart
        //Trace for bar
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'red'},
            type:"bar",
            orientation: "h",
        };

        var data = [trace];

        var layout = {
            title: `ID-${sample} Top 10 OTUs`
        }

        Plotly.newPlot('bar', data, layout)

        //Bubble Chart
        //Create variables for datapoints
        var bubbleSample = samples.otu_ids;
        var bubbleValues = samples.sample_values
        var bubbleLabels = samples.otu_labels

        //Create trace for bubble
        var traceBubble = {
            x: bubbleSample,
            y: bubbleValues,
            mode: "markers",
            marker: {
                size: bubbleValues,
                color: bubbleSample
            },
            text: bubbleLabels
  
        };

        var bubbleData = [traceBubble];

        var layoutBubble = {
            xaxis: {title: 'UTO ID' }
        }

        Plotly.newPlot('bubble', bubbleData, layoutBubble)

        var wfreq = data.metadata.map(d => d.wfreq)
        
        var data_g = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `Weekly Washing Frequency ` },
            type: "indicator",
            
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                     steps: [
                      { range: [0, 2], color: "yellow" },
                      { range: [2, 4], color: "cyan" },
                      { range: [4, 6], color: "teal" },
                      { range: [6, 8], color: "lime" },
                      { range: [8, 9], color: "green" },
                    ]}
                
            }
          ];
          var layout_g = { 
              width: 700, 
              height: 600, 
              margin: { t: 20, b: 40, l:100, r:100 } 
            };

          Plotly.newPlot("gauge", data_g);

    });
    
        
};

function getInfo(sample) {
    d3.json("../../data/samples.json").then(data=> {
        

        //Isolate for data
        var data = data.metadata
        console.log(data)
        //Get data for chosen sample
        var samples = data.filter(s => s.id.toString() === sample)[0]

        console.log(samples)
        //Select the metadata area to input
        var demoInfo = d3.select('#sample-metadata');

        //Clear output
        demoInfo.html('')
        
        //
        Object.entries(samples).forEach((key) => {   
            demoInfo.append("h4").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    })
};

function optionChanged(sample) {
    chart(sample);
    getInfo(sample)
};

function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("../../data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        chart(data.names[0]);
        getInfo(data.names[0]);
    });
};

init()