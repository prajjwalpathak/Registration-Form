const ctx = document.getElementById("Canvas");

const mixedChart = new Chart(ctx, {
    type: 'bar',
    data: {
        datasets: [
            {
                type: "bar",
                label: "Cold Coffee",
                data: [64, 81, 71, 65, 87, 6, 100, 34, 61, 44],
            },
            {
                type: "line",
                label: "Ice Cream",
                data: [83, 9, 95, 9, 24, 11, 49, 61, 73, 44],
            },
        ],
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
    },
});
