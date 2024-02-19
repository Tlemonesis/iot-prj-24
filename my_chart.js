var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1PM', '2PM', '3PM', '4PM', '5PM'],
        datasets: [
            { 
                label: 'Temperature',
                data: [26, 27, 28, 28, 27],
                borderColor: 'rgba(231, 76, 60,1)',
                borderWidth: 2,
                borderDash: [2, 2],
            },
            { 
                label: 'Humidity',
                data: [50, 40, 60, 40, 35],
                borderColor: 'rgba(45, 85, 255,1)',
                borderWidth: 2,
                borderDash: [20, 5],
            },
            { 
                label: 'Light',
                data: [350, 300, 250, 200, 150],
                borderColor: 'rgba(254, 241, 96, 1)',
                borderWidth: 2,
            }
        ]
    },
    options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: 'Chart'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          percentage: {
            type: 'linear',
            display: true,
            position: 'right',
            suggestedMin: 0,
            suggestedMax: 100,
    
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        }
      },
});