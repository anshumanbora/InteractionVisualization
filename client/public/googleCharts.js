
google.charts.load("current", {packages:["calendar","corechart","controls","scatter"]});




var allUsers = $.ajax({
    url: "/api/getallusers",
    dataType: "json",
    async: false
}).responseText;

allUser = JSON.parse(allUsers);
//console.log(allUser);

var select = document.getElementById("mySelect");

for (var i=0;i<allUser.length; i++){
     var opt = allUser[i];
     var el = document.createElement("option");
     el.textContent = opt;
     el.value = opt;
     select.appendChild(el);
}

var selectedUser = '';
//console.log('1'+selectedUser);

function selectUser() {

    selectedUser += document.getElementById("mySelect").value;
    console.log('2'+selectedUser);
    google.charts.setOnLoadCallback(drawChart(selectedUser));
    selectedUser = '';

}
var select2 = document.getElementById("mySelect2");

for (var i=0;i<allUser.length; i++){
    var opt = allUser[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select2.appendChild(el);
}

var selectedUser = '';
//console.log('1'+selectedUser);

function selectUser2() {

    selectedUser += document.getElementById("mySelect2").value;
    //console.log('2'+selectedUser);
    google.charts.setOnLoadCallback(drawLinks(selectedUser));
    selectedUser = '';

}


function drawChart() {

    var user = $.ajax({
        url: "/api/getcurrentuser",
        dataType: "json",
        async: false
    }).responseText;

    var someuser = selectedUser;
    var userlog = $.ajax({
        url: "/api/userlogs",
        data:JSON.stringify(someuser),
        dataType: "json",
        contentType: "application/json",
        async: false
    }).responseText;

    console.log('4'+selectedUser);

    userlog = JSON.parse(userlog);
    //console.log(userlog);

    var obj ={};

    for (var i=0; i<userlog.length; i++){
        if (selectedUser == userlog[i].substring(0,3)) {
            console.log(userlog[i].substring(0, 3));

            var day = userlog[i].substring(4, 15);
            console.log(day);

            if (obj[day]) {
                obj[day]++;
            }
            else {
                obj[day] = 1;
            }
        }
    }

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'frequency' });

    for(key in obj){
        var value = obj[key];
        //console.log(key);
        dataTable.addRows([
            [new Date(key), value]
        ]);
    }

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    var options = {
        title: selectedUser+" Log Frequency",
        height: 350,
    };

    chart.draw(dataTable, options);
}



function drawLinks() {

    var links = $.ajax({
        url: "/api/clicklinks",
        dataType: "json",
        async: false
    }).responseText;

    var obj = JSON.parse(links);
    console.log(obj);
    var array = [];

    console.log(selectedUser);
    var selectedIn = 0;
    var selectedOut = 0;
    var allIn = 0;
    var allOut = 0;

    for(key in obj){

        if(key == 'all-inside'){
            allIn= obj[key];
        }
        if(key == 'all-outside'){
            allOut= obj[key];
        }


        if(key.substring(0,2) == 'in' ){
            console.log('in');
            if(key.substring(6,9)==selectedUser){
                //console.log(key);
                selectedIn = obj[key];
            }
        }

        if(key.substring(0,3) == 'out' ){
            console.log('out');
            if(key.substring(7,10)==selectedUser){
                //console.log(key);
                selectedOut = obj[key];
            }
        }

    }
    //console.log(array);

    // var dataTable = new google.visualization.DataTable();
    // dataTable.addColumn({ type: 'date', id: 'Date' });
    // dataTable.addColumn({ type: 'number', id: 'frequency' });


    //
    var data = google.visualization.arrayToDataTable([
        ['Type of site', 'Number of sites'],
        ['Inside Stackoverflow',     selectedIn],
        ['Outside Stackoverflow',      selectedOut]

    ]);
    var dataall = google.visualization.arrayToDataTable([
        ['Type of site', 'Number of sites'],
        ['Inside Stackoverflow',     allIn],
        ['Outside Stackoverflow',      allOut]

    ]);

    var options = {
        title: 'Inside vs Outside',
        pieHole: 0.2,
    };
    var optionsall = {
        title: 'Inside vs Outside: Overall',
        pieHole: 0.2,
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);

    var chart = new google.visualization.PieChart(document.getElementById('donutchartall'));
    chart.draw(dataall, optionsall);

}



var tags = $.ajax({
    url: "/api/gettags",
    dataType: "json",
    async: false
}).responseText;

//console.log(tags);
var tags = JSON.parse(tags);

//google.charts.setOnLoadCallback(drawDashboard);
//console.log(tags);
var obj ={};
var userTags = {};
for (var j=0; j<allUser.length; j++){

    userTags[allUser[j]]=[];

    for (var i=0; i<tags.length; i++){
        //console.log(allUsers);
        if (allUser[j] == tags[i].substring(0,3)) {
            //console.log(tags[i].substring(0, 3));

            var element = tags[i].replace(allUser[j],"");

            arrayElement = element.split(",");

            //console.log(arrayElement);
            for (var k=0; k<arrayElement.length; k++){
                if(userTags[allUser[j]].indexOf(arrayElement[k]) == -1){
                    userTags[allUser[j]].push(arrayElement[k]);
                    //console.log(arrayElement[k]);
                }
                //userTags[allUsers[j]]+=obj[arrayElement[k]];



                if (obj[arrayElement[k]]) {
                    obj[arrayElement[k]]++;
                }
                else {
                    obj[arrayElement[k]] = 1;
                }
            }

        }
    }

}

for (key in userTags){
    //console.log(key+' : '+userTags[key]);
}

google.charts.setOnLoadCallback(drawScatter);

function drawScatter () {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'tag');
    data.addColumn('number', 'occurence');

    for(key in obj){

        data.addRows([
            // ['word1', 1] , ['word2', 3]
            [key,obj[key]]
        ]);

    }


    var options = {
        width: 1000,
        height: 300,
        chart: {
            title: 'weight of terms'
        },
        axes: {
            x: {
                0: {side: 'bottom'}
            }
        }
    };

    var chart = new google.charts.Scatter(document.getElementById('scatter_top_x'));

    chart.draw(data, google.charts.Scatter.convertOptions(options));

    //adding event listener
    //google.visualization.events.addListener(chart, 'select', selectionHandler);



    google.visualization.events.addListener(chart,'select', function(e) {
        var selection = chart.getSelection();
        var lat = data.getValue(selection[0].row, 0); // HERE is where I get the value!
        var lon = data.getValue(selection[0].row, 1);
        //alert(lat + ", " + lon);

        var div = document.getElementById('tagdetails');
        div.innerHTML='';
        for (var i=0; i<allUser.length; i++){


        if(userTags[allUser[i]].indexOf(lat) != -1){

            console.log(userTags[allUser[i]]);
            div.innerHTML += allUser[i];

        }


    }



    });
    // function selectionHandler() {
    //     var selection = chart.getSelection();
    //     var message = '';
    //     for (var i = 0; i < selection.length; i++) {
    //         var item = selection[i];
    //         console.log(data.getValue(item.row, item.column));
    //         if (item.row != null && item.column != null) {
    //             //var str = data.getFormattedValue(item.row, item.column);
    //             var str = data.getColumnLabel(item.column);
    //             message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
    //         } else if (item.row != null) {
    //             //var str = data.getFormattedValue(item.row, 0);
    //             var str = data.getColumnLabel(item.row,0);
    //             message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
    //         } else if (item.column != null) {
    //             //var str = data.getFormattedValue(0, item.column);
    //             var str = data.getColumnLabel(0,item.column);
    //             message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
    //         }
    //     }
    //     if (message == '') {
    //         message = 'nothing';
    //     }
    //     alert('You selected ' + message);
    // }


}


// function drawDashboard() {
//     // Everything is loaded. Assemble your dashboard...
//
//     var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
//     // Create a range slider, passing some options
//     var donutRangeSlider = new google.visualization.ControlWrapper({
//         'controlType': 'NumberRangeFilter',
//         'containerId': 'filter_div',
//         'options': {
//             'filterColumnLabel': 'Year',
//             'minValue': 2004,
//             'maxValue': 2011
//         }
//     });
//
//     var data = google.visualization.arrayToDataTable([
//         ['Year', 'Sales', 'Expenses'],
//         [2004,  1000,      400],
//         [2005,  1170,      460],
//         [2006,  660,       1120],
//         [2007,  1030,      540],
//         [2008,  1000,      600],
//         [2009,  1170,      460],
//         [2010,  660,       1120],
//         [2011,  1030,      1540]
//     ]);
//
//     var options = {
//         title: 'Company Performance',
//         curveType: 'function',
//         legend: { position: 'bottom' }
//     };
//
//     var chart = new google.visualization.ChartWrapper({
//         'chartType': 'LineChart',
//         'containerId': 'chart_div',
//         'options': {
//             'width': 700,
//             'height': 300,
//             'legend': 'none',
//
//         }
//
//     });
//
//
//     // The rest of dashboard configuration follows
//     // ...
//     dashboard.bind(donutRangeSlider, chart);
//     dashboard.draw(data);
// }


//--------------------D3------------------------

