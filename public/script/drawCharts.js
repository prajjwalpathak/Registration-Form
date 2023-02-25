const ctx = document.getElementById('goodCanvas1');

const mixedChart = new Chart(ctx, {
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
