let sideEffectsChart;

const searchForm = () => {
    const searchQueryElem = document.querySelector('.search-input');
    const searchQuery = searchQueryElem.value;

    if (!searchQuery) {
        searchQueryElem.classList.add('is-invalid');
    } else {
        searchQueryElem.classList.remove('is-invalid');
    }

    searchAdverseEvents(searchQuery)
        .then((response) => {
            clearResults();
            if (response.results && response.results.length > 0) {
                showAdverseEvents(response.results, searchQuery);
            } else {
                displayText('There are no results.');
            }
        })
        .catch((error) => {
            console.error(error);
            clearResults();
            displayText('No connection. Please try again');
        });

    return false;
}

const clearResults = () => {
    document.getElementById("results").innerHTML = "";
}

const displayText = (text) => {
    const textElem = document.createElement("p");
    textElem.classList.add("text-center");
    textElem.classList.add("empty-results");
    textElem.textContent = text;
    document.getElementById("results").appendChild(textElem);
}

const convertObjToParams = (obj) => {
    let str = "";
    for (let key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
}

const searchAdverseEvents = (searchQuery) => {
    let url = "https://api.fda.gov/drug/event.json?"

    url += convertObjToParams({
        search: 'patient.drug.medicinalproduct:"' + searchQuery + '"',
        count: 'patient.reaction.reactionmeddrapt.exact',
        api_key:'1u8jI4TvqF9y4oHUo7RIeDrpq8PZVN9yBOxB6LC1',
    });

    return fetch(url, {mode: 'cors'})
    .then((response) => {
        return response.json()
    });

}

function changeData(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

const showAdverseEvents = (results, drug) => {
    let myChart = document.getElementById('mychart').getContext('2d');

    var terms = [];
    var counts = [];
    for (i = 0; i < 5; i++) {
        terms.push(results[i].term)
        counts.push(results[i].count)

    }

    console.log(terms);
    console.log(counts);

    if (sideEffectsChart) {
        changeData(sideEffectsChart, terms, counts);
        sideEffectsChart.options.title.text = drug;
    }
    else {
        sideEffectsChart = new Chart(myChart, {
            type: 'doughnut',//bar,horizontal bar,pie,radar,line,polararea
            data: {
                labels: terms,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                    hoverBorderColor:'#000'
                }],


            },
            options: {
                title: {
                    display: true,
                    text: drug
                },
                legend :{
                    position :'right'
                }
            }
        });
    }

}

