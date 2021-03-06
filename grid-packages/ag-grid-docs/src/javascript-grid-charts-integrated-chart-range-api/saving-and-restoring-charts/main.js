var columnDefs = [
    { field: "country", chartDataType: 'category' },
    { field: "sugar", chartDataType: 'series' },
    { field: "fat", chartDataType: 'series' },
    { field: "weight", chartDataType: 'series' },
];

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
    createChartContainer: createChartContainer,
    popupParent: document.body
};

var chartModel;
var currentChartRef;

function createChartContainer(chartRef) {
    // destroy existing chart
    if (currentChartRef) {
        currentChartRef.destroyChart();
    }

    var eChart = chartRef.chartElement;
    var eParent = document.querySelector('#myChart');
    eParent.appendChild(eChart);
    currentChartRef = chartRef;
}

function createRowData() {
    var countries = ["Ireland", "Spain", "United Kingdom", "France", "Germany", "Luxembourg", "Sweden",
        "Norway", "Italy", "Greece", "Iceland", "Portugal", "Malta", "Brazil", "Argentina",
        "Colombia", "Peru", "Venezuela", "Uruguay", "Belgium"];

    return countries.map(function(country) {
        return {
            country: country,
            sugar: Math.floor(Math.floor(Math.random() * 50)),
            fat: Math.floor(Math.floor(Math.random() * 100)),
            weight: Math.floor(Math.floor(Math.random() * 200))
        };
    });
}

function saveChart() {
    var chartModels = gridOptions.api.getChartModels();

    if (chartModels.length > 0) {
        chartModel = chartModels[0];
    }

    alert("Chart saved!");
}

function clearChart() {
    if (currentChartRef) {
        currentChartRef.destroyChart();
        currentChartRef = null;
    }
}

function restoreChart() {
    if (!chartModel) {
        return;
    }

    this.clearChart();

    var options = chartModel.chartOptions;
    var createRangeChartParams = {
        chartContainer: document.querySelector('#myChart'),
        cellRange: chartModel.cellRange,
        chartType: chartModel.chartType,
        chartPalette: chartModel.chartPalette,
        processChartOptions: function() { return options; }
    };

    currentChartRef = gridOptions.api.createRangeChart(createRangeChartParams);

    chartModel = undefined;
}

function openImage(type) {
    var chartModel = gridOptions.api.getChartModels()[0];

    if (chartModel) {
        var imageDataUrl = chartModel.getChartImageDataURL({ type: type });
        var image = new Image();
        image.src = imageDataUrl;

        var w = window.open("");
        w.document.write(image.outerHTML);
        w.document.close();
    }
}

function openPng() {
    openImage('image/png');
}

function openJpg() {
    openImage('image/jpeg');
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
