var columnDefs = [
    { field: "country", width: 150, chartDataType: 'category' },
    { field: "gold", chartDataType: 'series' },
    { field: "silver", chartDataType: 'series' },
    { field: "bronze", chartDataType: 'series' },
    { headerName: "A", valueGetter: 'Math.floor(Math.random()*1000)', chartDataType: 'series' },
    { headerName: "B", valueGetter: 'Math.floor(Math.random()*1000)', chartDataType: 'series' },
    { headerName: "C", valueGetter: 'Math.floor(Math.random()*1000)', chartDataType: 'series' },
    { headerName: "D", valueGetter: 'Math.floor(Math.random()*1000)', chartDataType: 'series' }
];

function createRowData() {
    var countries = [
        "Ireland", "Spain", "United Kingdom", "France", "Germany", "Luxembourg", "Sweden",
        "Norway", "Italy", "Greece", "Iceland", "Portugal", "Malta", "Brazil", "Argentina",
        "Colombia", "Peru", "Venezuela", "Uruguay", "Belgium"
    ];

    return countries.map(function(country, index) {
        return {
            country: country,
            gold: Math.floor(((index + 1 / 7) * 333) % 100),
            silver: Math.floor(((index + 1 / 3) * 555) % 100),
            bronze: Math.floor(((index + 1 / 7.3) * 777) % 100),
        };
    });
}

var gridOptions = {
    defaultColDef: {
        editable: true,
        sortable: true,
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true
    },
    popupParent: document.body,
    columnDefs: columnDefs,
    rowData: createRowData(),
    enableRangeSelection: true,
    enableCharts: true,
    onFirstDataRendered: onFirstDataRendered,
    processChartOptions: processChartOptions,
};

function processChartOptions(params) {
    var options = params.options;

    console.log('chart options:', options);

    // we are only interested in processing line type.
    // so if user changes the type using the chart control,
    // we ignore it.
    if (params.type !== 'line') {
        console.log('chart type is ' + params.type + ', making no changes.');
        return params.options;
    }

    options.seriesDefaults.fill.colors = ['#e1ba00', 'silver', 'peru'];
    options.seriesDefaults.fill.opacity = 0.7;

    options.seriesDefaults.stroke.colors = ['black', '#ff0000'];
    options.seriesDefaults.stroke.opacity = 0.6;
    options.seriesDefaults.stroke.width = 5;

    options.seriesDefaults.highlightStyle.fill = 'red';
    options.seriesDefaults.highlightStyle.stroke = 'yellow';

    options.seriesDefaults.marker.enabled = true;
    options.seriesDefaults.marker.type = 'diamond';
    options.seriesDefaults.marker.size = 12;
    options.seriesDefaults.marker.strokeWidth = 4;

    options.seriesDefaults.tooltip.renderer = function(params) {
        var x = params.datum[params.xKey];
        var y = params.datum[params.yKey];
        return '<u style="color: ' + params.color + '">' + params.title + '</u><br><br><b>' + params.xName.toUpperCase() + ':</b> ' + x + '<br/><b>' + params.yName.toUpperCase() + ':</b> ' + y;
    };

    return options;
}

function onFirstDataRendered(params) {
    var cellRange = {
        rowStartIndex: 0,
        rowEndIndex: 4,
        columns: ['country', 'gold', 'silver', 'bronze']
    };

    var createRangeChartParams = {
        cellRange: cellRange,
        chartType: 'line'
    };

    params.api.createRangeChart(createRangeChartParams);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
