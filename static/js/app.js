const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// READS IN DATA FROM URL
d3.json(url).then(function(data){
    
    // SETS UP VARIABLES FOR REQUIRED OBJECTS
    console.log(data);
    let samples = data.samples;
    let metadata = data.metadata;
    console.log(samples);
    console.log(metadata);

    // CREATES CHARTS FROM SAMPLE OBJECT
    function sampleCharts(sampleId){
       // This returns all objects within the array that have an id the same as the argument id.
        let sampleData = samples.filter(function (sample){
            // we specify [0] here because filter always returns an array
            // even though we expect only one item will be returned.
            return sample.id == sampleId;
        })[0];
        console.log(sampleData);
        let sortedData=sampleData.sample_values.map(function(value,index){
            return{
                sample_value: value,
                otu_id: sampleData.otu_ids[index],
                otu_labels: sampleData.otu_labels[index]
            };
        }).sort(function(a,b){
            return b.sample_value - a.sample_value;
        });
        
        let sliced_data = sortedData.slice(0,10).reverse();

        // Horizontal bar graph
        let tracedata = {
            x: sliced_data.map(s=>s.sample_value),
            y: sliced_data.map(s=>`ID: ${s.otu_id}`),
            type: "bar",
            orientation: "h"
        };
        let layout = {
            title: `Main OTUs detected in Sample ${sampleId}:`
        };
        Plotly.newPlot('bar',[tracedata],layout);
        
        //Bubble Graph
        let tracedata2 = {
            x:sortedData.map(t=>t.otu_id),
            y:sortedData.map(t=>t.sample_value),
            text: sortedData.map(t=>t.otu_labels),
            mode: "markers",
            marker: {
                color:sortedData.map(t=>t.otu_id),
                size:sortedData.map(t=>t.sample_value/2)
            }
        };
        let layout2 = {
            title: `Frequency of OTUs for Sample ${sampleId}:`,
            showlegend: false,
            height: 500,
            width: 1100
        };
        Plotly.newPlot('bubble',[tracedata2],layout2);
    }
    
    //PULLS INFO FROM METADATA ARRAY
    function getMetadata(sample){
        let Meta = metadata.filter(function (m){
        return m.id == sample;
        })[0];

        let metadataText = d3.select("#sample-metadata");
        
        metadataText.html("")

        metadataText.append("p").text(`ID: ${Meta.id}`);
        metadataText.append("p").text(`Ethnicity: ${Meta.ethnicity}`);
        metadataText.append("p").text(`Gender: ${Meta.gender}`);
        metadataText.append("p").text(`Age: ${Meta.age}`);
        metadataText.append("p").text(`Location: ${Meta.location}`);
        metadataText.append("p").text(`bb type: ${Meta.bbtype}`);
        metadataText.append("p").text(`wfreq: ${Meta.wfreq}`);
        

        // //Gauge Chart
        let tracedata3 = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: Meta.wfreq,
        title: { text: `Wash frequency for Sample ${sample}`},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
        axis: { range: [null, 9] },
        steps: [
        { range: [0, 1], color: "gray",text:"0-1" },
        { range: [1, 2], color: "silver",text:"1-2" },
        { range: [2, 3], color: "lightgray",text:"2-3" },
        { range: [3, 4], color: "gainsboro",text:"3-4" },
        { range: [4, 5], color: "honeydew",text:"4-5" },
        { range: [5, 6], color: "lightgreen",text:"5-6" },
        { range: [6, 7], color: "greenyellow",text:"6-7" },
        { range: [7, 8], color: "lawngreen",text:"7-8" },
        { range: [8, 9], color: "lime",text:"8-9" }
        ]
        }
    }
    ];

var layout3 = { width: 600, height: 450, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', tracedata3, layout3);



    }
    function init(){
        let init = samples[0].id;
        sampleCharts(init);
        getMetadata(init);
    };
    
    let dropdown = d3.select("#selDataset");
    dropdown.selectAll("option").data(samples).enter().append("option").attr("value",function(s){return s.id;}).text(function(d){return "Sample "+ d.id;});
    dropdown.on('change',function(){
    let selectedId = d3.select(this).property('value');
    sampleCharts(selectedId);
    getMetadata(selectedId);
    
    });

    init();
});



    















