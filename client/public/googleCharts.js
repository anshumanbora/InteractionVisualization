
google.charts.load("current", {packages:["calendar"]});
google.charts.setOnLoadCallback(drawChart);



function drawChart() {

    var user = $.ajax({
        url: "/api/getcurrentuser",
        dataType: "json",
        async: false
    }).responseText;

    var userlog = $.ajax({
        url: "/api/userlogs",
        data:user,
        dataType: "json",
        async: false
    }).responseText;

    //cleaning the received data
    userlog = userlog.replace("[","");
    userlog = userlog.replace("]","");
    var st = userlog.split(",");

    //creating a hash table where key = date
    // and value = log frequency
    var obj ={};

    for (var i=0; i<st.length; i++){

        var day = st[i].substring(1,9);

        if (obj[day]) {
                 obj[day]++;
               }
               else {
                 obj[day] = 1;
               }

    }
    console.log(obj);



    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'frequency' });

    for(key in obj){
        var value = obj[key];
        dataTable.addRows([
            [new Date(key), value]
        ]);


    }
    // dataTable.addRows([
    //
    //     // Many rows omitted for brevity.
    //     [new Date('2017-9-8'), 3],
    //     [ new Date(2017, 9, 4), 1 ],
    //     [ new Date(2017, 9, 5), 2 ],
    //     [ new Date(2017, 9, 12), 2 ],
    //     [ new Date(2017, 9, 13), 3 ],
    //     [ new Date(2017, 9, 19), 1 ],
    //     [ new Date(2017, 9, 23), 3 ],
    //     [ new Date(2017, 9, 24), 1 ],
    //     [ new Date(2017, 9, 30), 2 ]
    // ]);

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    var options = {
        title: user+" Log Frequency",
        height: 350,
    };

    chart.draw(dataTable, options);
}



