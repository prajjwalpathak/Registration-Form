let chartData = [];

fetch("http://localhost:3000/chart-data")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        chartData = data;
    })
    .catch((error) => {
        console.log(error);
    });

const createChart = () => {
    console.log(chartData);
};

const ctx = document.getElementById("Canvas");

const mixedChart = new Chart(ctx, {
    data: {
        datasets: [
            {
                type: "bar",
                label: "Bar Dataset",
                data: [10, 20, 30, 40],
            },
            {
                type: "line",
                label: "Line Dataset",
                data: [10, 20, 30, 40],
            },
        ],
        labels: ["January", "February", "March", "April"],
    },
});
