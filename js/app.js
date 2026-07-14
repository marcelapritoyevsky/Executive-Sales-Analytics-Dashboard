/* ==========================================================
   Application Initialization
========================================================== */

const appState = {
    salesData: []
};


async function loadSalesData() {

    try {

        const response =
            await fetch("data/sales.json");

        const data =
            await response.json();

        appState.salesData = data;
 
        populateFilters(
            appState.salesData
        );

        console.log(
            "Sales data loaded successfully."
        );

        console.log(
            "Records loaded:",
            data.length
        );


    } catch (error) {

        console.error(
            "Error loading sales data:",
            error
        );

    }

}


function populateFilters(data) {

    const modelFilter =
        document.getElementById(
            "model-filter"
        );

    const stateFilter =
        document.getElementById(
            "state-filter"
        );

    const yearFilter =
        document.getElementById(
            "year-filter"
        );

    const statusFilter =
        document.getElementById(
            "status-filter"
        );


    const models =
        [...new Set(
            data.map(
                item => item.model
            )
        )]
        .sort();


    const states =
        [...new Set(
            data.map(
                item => item.state
            )
        )]
        .sort();


    const years =
        [...new Set(
            data.map(
                item => item.modelYear
            )
        )]
        .sort();


    const statuses =
        [...new Set(
            data.map(
                item => item.deliveryStatus
            )
        )]
        .sort();


    models.forEach(model => {

        modelFilter.innerHTML +=
            `
            <option value="${model}">
                ${model}
            </option>
            `;

    });


    states.forEach(state => {

        stateFilter.innerHTML +=
            `
            <option value="${state}">
                ${state}
            </option>
            `;

    });


    years.forEach(year => {

        yearFilter.innerHTML +=
            `
            <option value="${year}">
                ${year}
            </option>
            `;

    });


    statuses.forEach(status => {

        statusFilter.innerHTML +=
            `
            <option value="${status}">
                ${status}
            </option>
            `;

    });

}

function applyFilters() {

    const selectedModel =
        document.getElementById(
            "model-filter"
        ).value;


    const selectedState =
        document.getElementById(
            "state-filter"
        ).value;


    const selectedYear =
        document.getElementById(
            "year-filter"
        ).value;


    const selectedStatus =
        document.getElementById(
            "status-filter"
        ).value;


    const filteredData =
        appState.salesData.filter(
            item => {

                return (

                    (!selectedModel ||
                        item.model === selectedModel)

                    &&

                    (!selectedState ||
                        item.state === selectedState)

                    &&

                    (!selectedYear ||
                        String(item.modelYear)
                        === selectedYear)

                    &&

                    (!selectedStatus ||
                        item.deliveryStatus === selectedStatus)

                );

            }
        );


    updateDashboardFromData(
        filteredData
    );

}


function updateDashboardFromData(data) {


if (!data || data.length === 0) {

    console.warn(
        "No sales records found for selected filters."
    );


    const emptyMetrics =
        window.dashboardModule.buildDashboardMetrics([]);


    window.dashboardModule.updateDashboard(
        emptyMetrics
    );


    window.dashboardModule.createRegionChart(
        emptyMetrics.regionRevenue
    );


    window.dashboardModule.createStateChart(
        emptyMetrics.stateRevenue
    );


    window.dashboardModule.createModelChart(
        emptyMetrics.modelRevenue
    );


    return;

}


    const metrics =
        window.dashboardModule.buildDashboardMetrics(
            data
        );


    window.dashboardModule.updateDashboard(
        metrics
    );


    window.dashboardModule.createRegionChart(
        metrics.regionRevenue
    );


    window.dashboardModule.createStateChart(
        metrics.stateRevenue
    );


    window.dashboardModule.createModelChart(
        metrics.modelRevenue
    );

}

function setupFilterEvents() {

    const filters = [

        "model-filter",
        "state-filter",
        "year-filter",
        "status-filter"

    ];


    filters.forEach(
        filterId => {

            const filter =
                document.getElementById(
                    filterId
                );


            if (filter) {

                filter.addEventListener(
                    "change",
                    function () {

                       applyFilters();

    }
);

            }

        }
    );

}


/* ==========================================================
   Component Initialization
========================================================== */

function initializeComponents() {

    console.log(
        "Initializing dashboard components..."
    );


    if (
        typeof window.dashboardModule === "undefined"
    ) {

        console.error(
            "dashboard.js was not loaded."
        );

        return;

    }


    const metrics =
        window.dashboardModule.buildDashboardMetrics(
            appState.salesData
        );


    window.dashboardModule.updateDashboard(
        metrics
    );

window.dashboardModule.createRegionChart(
    metrics.regionRevenue
);

window.dashboardModule.createStateChart(
    metrics.stateRevenue
);

window.dashboardModule.createModelChart(
    metrics.modelRevenue
);


    console.log(
        "Dashboard initialized successfully."
    );

}



/* ==========================================================
   Application Start
========================================================== */

async function initializeDashboard() {

    console.log(
        "Initializing Executive Sales Analytics Dashboard..."
    );


    await loadSalesData();


setupFilterEvents();


initializeComponents();


    console.log(
        "Dashboard ready."
    );

}


initializeDashboard();

window.applyFilters = applyFilters;