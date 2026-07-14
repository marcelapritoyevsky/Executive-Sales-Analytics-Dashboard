let charts = {};

let salesData = [];

function formatCurrency(value) {

    if (value >= 1000000) {

        return "$" + (value / 1000000).toFixed(2) + "M";

    }

    if (value >= 1000) {

        return "$" + (value / 1000).toFixed(1) + "K";

    }

    return "$" + value.toFixed(0);

}

const stateNames = {

    MA: "Massachusetts",
    WA: "Washington",
    TX: "Texas",
    CO: "Colorado",
    CA: "California",
    FL: "Florida",
    NY: "New York",
    IL: "Illinois",
    AZ: "Arizona",
    NV: "Nevada",
    GA: "Georgia",
    OR: "Oregon",
    NC: "North Carolina",
    TN: "Tennessee",
    MN: "Minnesota",
    PA: "Pennsylvania",
    UT: "Utah",
    MI: "Michigan",
    OH: "Ohio",
    IN: "Indiana",
    WI: "Wisconsin",
    MO: "Missouri",
    NE: "Nebraska",
    NM: "New Mexico",
    VA: "Virginia",
    OK: "Oklahoma",
    KS: "Kansas",
    LA: "Louisiana",
    HI: "Hawaii",
    KY: "Kentucky",
    AK: "Alaska",
    NJ: "New Jersey",
    ID: "Idaho"

};

function loadDashboardData(data) {
    salesData = data;

    const metrics = calculateDashboardMetrics(salesData);

    updateDashboard(metrics);
}


function calculateDashboardMetrics(data) {
const stateRegions = {

Northeast: [
        "CT", "ME", "MA",
        "NH", "RI", "VT",
        "NJ", "NY", "PA"
    ],

    Midwest: [
        "IL", "IN", "MI",
        "OH", "WI",
        "IA", "KS", "MN",
        "MO", "NE",
        "ND", "SD"
    ],

    South: [
        "DE", "DC", "FL",
        "GA", "MD", "NC",
        "SC", "VA", "WV",
        "AL", "KY", "MS",
        "TN", "AR", "LA",
        "OK", "TX"
    ],

    West: [
        "AZ", "CO", "ID",
        "MT", "NV", "NM",
        "UT", "WY",
        "AK", "CA",
        "HI", "OR",
        "WA"
    ]

};

    const totalRevenue = data.reduce(
    (sum, item) => sum + Number(item.sales || 0),
    0
);

    const vehiclesSold = data.length;

    const averageVehiclePrice =
        vehiclesSold > 0
            ? totalRevenue / vehiclesSold
            : 0;


    const modelCount = {};

    data.forEach(item => {

        const model =
    item.model || "Unknown";

        modelCount[model] =
            (modelCount[model] || 0) + 1;

    });


    const bestSellingModel =
        Object.entries(modelCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0]
            || "N/A";

const modelRevenue = {};

data.forEach(item => {

    const model =
        item.model || "Unknown";

    modelRevenue[model] =
        (modelRevenue[model] || 0)
        + Number(item.sales || 0);

});


    const regionRevenue = {};

    const stateRevenue = {};

data.forEach(item => {

    const state =
        item.state || "Unknown";


    let region = "Unknown";


    for (const regionName in stateRegions) {

        if (
            stateRegions[regionName]
                .includes(state)
        ) {

            region = regionName;
            break;

        }

    }


    regionRevenue[region] =
        (regionRevenue[region] || 0)
        + Number(item.sales || 0);


   stateRevenue[state] =
    (stateRevenue[state] || 0)
    + Number(item.sales || 0);

});


const topSalesRegion =
    Object.entries(regionRevenue)
        .sort((a, b) => b[1] - a[1])[0]?.[0]
        || "N/A";


    const averageMileage =
    vehiclesSold > 0
        ? data.reduce(
            (sum, item) =>
                sum + Number(item.mileage || 0),
            0
        ) / vehiclesSold
        : 0;


    const averageVehicleYear =
    vehiclesSold > 0
        ? data.reduce(
            (sum, item) =>
                sum + Number(item.modelYear || 0),
            0
        ) / vehiclesSold
        : 0;


    const deliveredVehicles =
        data.filter(
            item =>
                String(item.deliveryStatus)
                    .toLowerCase()
                    .includes("delivered")
        ).length;


const deliveryCompletionRate =
    vehiclesSold > 0
        ? (deliveredVehicles / vehiclesSold) * 100
        : 0;



    return {

        totalRevenue,

        vehiclesSold,

        averageVehiclePrice,

        bestSellingModel,

        topSalesRegion,

        averageMileage,

        averageVehicleYear,

        deliveryCompletionRate,
        
        regionRevenue,
       
        modelRevenue,

        stateRevenue
    };

}


function updateDashboard(metrics) {

    console.log(
        "Dashboard metrics:",
        metrics
    );


    document.getElementById(
        "total-sales"
    ).textContent =
        metrics.totalRevenue.toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    document.getElementById(
        "total-orders"
    ).textContent =
        metrics.vehiclesSold;


    document.getElementById(
        "average-order"
    ).textContent =
        metrics.averageVehiclePrice.toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    document.getElementById(
        "top-region"
    ).textContent =
        metrics.topSalesRegion;


document.getElementById(
    "best-model"
).textContent =
    metrics.bestSellingModel;


document.getElementById(
    "average-mileage"
).textContent =
    Math.round(metrics.averageMileage).toLocaleString("en-US");


document.getElementById(
    "average-year"
).textContent =
    Math.round(metrics.averageVehicleYear);


document.getElementById(
    "delivery-rate"
).textContent =
    metrics.deliveryCompletionRate.toFixed(1) + "%";

}

function createRegionChart(regionRevenue) {

    const ctx =
        document.getElementById(
            "sales-region-chart"
        );


    if (!ctx) {

        console.error(
            "Region chart canvas not found."
        );

        return;

    }
 
if (charts.region) {

    charts.region.destroy();

}

    charts.region = new Chart(
        ctx,
        {

            type: "bar",

            data: {

                labels:
                Object.keys(regionRevenue),

                datasets: [
                    {

                        label:
                            "Sales Revenue",

                        data:
                            Object.values(regionRevenue)
                    }
                ]

            },

            options: {

                responsive: true,

                plugins: {

    legend: {

        display: false

    },

    tooltip: {

        callbacks: {

            label: function(context) {

                return "Sales Revenue: "
                    + formatCurrency(context.raw);

            }

        }

    }

}

            }

        }
    );

}



function createModelChart(modelRevenue) {

    const ctx =
        document.getElementById(
            "sales-trend-chart"
        );


    if (!ctx) {

        console.error(
            "Model chart canvas not found."
        );

        return;

    }



const sortedModels =
    Object.entries(modelRevenue)
        .sort((a, b) => b[1] - a[1]);


const modelLabels =
    sortedModels.map(item => item[0]);


const modelValues =
    sortedModels.map(item => item[1]);

const existingChart =
    Chart.getChart(ctx);

if (existingChart) {

    existingChart.destroy();

}
    charts.model = new Chart(
        ctx,
        {

            type: "bar",

            data: {

    labels:
        modelLabels,

    datasets: [
        {

            label:
                "Sales Revenue",

            data:
                modelValues

        }
    ]

},

            options: {

    indexAxis: "y",

    responsive: true,

    maintainAspectRatio: false,
scales: {

    y: {

        ticks: {

            autoSkip: false

        }

    }

},
                plugins: {

    legend: {

        display: false

    },

    tooltip: {

        callbacks: {

            label: function(context) {

                return "Sales Revenue: "
                    + formatCurrency(context.raw);

            }

        }

    }

}

            }

        }
    );

}


function createStateChart(stateRevenue) {

    const ctx =
        document.getElementById(
            "sales-state-chart"
        );


    if (!ctx) {

        console.error(
            "State chart canvas not found."
        );

        return;

    }


    const sortedStates =
        Object.entries(stateRevenue)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);


    const stateLabels =
        sortedStates.map(
            item =>
                stateNames[item[0]]
                || item[0]
        );


    const stateValues =
        sortedStates.map(
            item =>
                item[1]
        );

if (charts.state) {

    charts.state.destroy();

}

    charts.state = new Chart(
        ctx,
        {

            type: "bar",

            data: {

                labels:
                    stateLabels,

                datasets: [
                    {

                        label:
                            "Sales Revenue",

                        data:
                            stateValues

                    }
                ]

            },

            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        ticks: {

                            autoSkip: false

                        }

                    }

                },

                plugins: {

    legend: {

        display: false

    },

    tooltip: {

        callbacks: {

            label: function(context) {

                return "Sales Revenue: "
                    + formatCurrency(context.raw);

            }

        }

    }

}

            }

        }
    );

}

function createGeographicMap() {


    const container =
        document.getElementById(
            "usa-map-container"
        );

    if (!container) {

        console.error(
            "USA map container not found."
        );

        return;

    }


    fetch("assets/usa-map.svg")
    .then(response => {

        if (!response.ok) {

            throw new Error(
                "SVG map file not found."
            );

        }

        return response.text();

    })
    .then(svg => {

        container.innerHTML = svg;

    })
        .catch(error => {

            console.error(
                "Error loading USA map:",
                error
            );

        });

}

window.dashboardModule = {
    buildDashboardMetrics: calculateDashboardMetrics,
    updateDashboard,
    createRegionChart,
    createModelChart,
    createStateChart,
    createGeographicMap
};