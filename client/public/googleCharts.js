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



google.charts.load("current", {packages:["calendar","corechart"]});

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
