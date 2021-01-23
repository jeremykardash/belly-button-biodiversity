
//Function that charts all the data
function chart(sample) {
    d3.json("samples.json").then(data=> {
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
              color: 'rgb(116,173,209)'},
            type:"bar",
            orientation: "h",
        };

        //Data for bar
        var dataBar = [trace];

        //Layout for bar
        var layout = {
            title: `ID-${sample} Top 10 OTUs`};

        //Plot bar chart
        Plotly.newPlot('bar', dataBar, layout);


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

        //Data for bubble
        var bubbleData = [traceBubble];

        //Layout for bubble
        var layoutBubble = {
            xaxis: {title: 'UTO ID' }
        }

        //Plot bubble
        Plotly.newPlot('bubble', bubbleData, layoutBubble)


        //Gauge Plot
        //Get wash frequency for gauge chart
        var metadata = data.metadata.filter(s => s.id.toString() === sample)[0]
        var wfreq = metadata.wfreq

        //Create trace/data for Gauge
        var dataGauge = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `Weekly Washing Frequency` },
            type: "indicator",
            
            mode: "gauge+number",

            gauge: { axis: { range: [null, 9] },
                     steps: [
                      { range: [0, 1], color: "rgb(215,48,39)" },
                      { range: [1, 2], color: "rgb(244,109,67)" },
                      { range: [2, 3], color: "rgb(253,174,97)" },
                      { range: [3, 4], color: "rgb(254,224,144)" },
                      { range: [4, 5], color: "rgb(224,243,248)" },
                      { range: [5, 6], color: "rgb(171,217,233)" },
                      { range: [6, 7], color: "rgb(116,173,209)" },
                      { range: [7, 8], color: "rgb(69,117,180)" },
                      { range: [8, 9], color: "rgb(49,54,149)" },
                    ]}
                
            }
          ];
          var layoutGauge = { 
              width: 700, 
              height: 600, 
              margin: { t: 20, b: 40, l:100, r:100 } 
            };

          Plotly.newPlot("gauge", dataGauge, layoutGauge);

    });
    
        
};

function getInfo(sample) {
    d3.json("samples.json").then(data=> {
        

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
            demoInfo.append("p").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    })
};

//Option changed function relates the the selection field on the page and will change wil the input
function optionChanged(sample) {
    chart(sample);
    getInfo(sample)
};

function init() {
    // select dropdown menu item
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        //Append the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        //Call the functions to display the data and the plots to the page
        chart(data.names[0]);
        getInfo(data.names[0]);
    });
};

//Call the initial function to load page
init();