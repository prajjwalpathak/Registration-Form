const Chart = require("chart");

const canvas = document.getElementById('Canvas');

const mixedChart = new Chart(canvas, {
    data: {
        datasets: [{
            type: 'bar',
            label: 'Bar Dataset',
            data: [10, 20, 30, 40]
        }, {
            type: 'line',
            label: 'Line Dataset',
            data: [10, 20, 30, 40],
        }],
        labels: ['January', 'February', 'March', 'April']
    }
});
