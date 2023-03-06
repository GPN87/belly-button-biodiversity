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
    function createChart(sampleId){
        let sampleData = samples.filter(function (sample){
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
        }).slice(0,10).reverse();

        // Horizontal bar graph
        let tracedata = {
            x: sortedData.map(s=>s.sample_value),
            y: sortedData.map(s=>`ID: ${s.otu_id}`),
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
                size:sortedData.map(t=>t.sample_value)
            }
        };
        let layout2 = {
            title: 'Bubble Chart of OTUs',
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
        
    }
    
    function init(){
        let init = samples[0].id;
        createChart(init);
        getMetadata(init);
    };
    
    let dropdown = d3.select("#selDataset");
    let dropdownoptions = dropdown.selectAll("option").data(samples).enter().append("option").attr("value",function(s){return s.id;}).text(function(d){return "Sample "+ d.id;});
    dropdown.on('change',function(){
    let selectedId = d3.select(this).property('value');
    createChart(selectedId);
    getMetadata(selectedId);
    
    });

    init();
});



    















