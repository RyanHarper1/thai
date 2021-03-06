var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

function checkDate() {
    var date = document.getElementById("orderDate");
    // console.log((date.value));
    var d = new Date(date.value);
    var n = d.getDay();


    // if(n != 5){
    //     alert('Please select a valid Friday');
    //     document.getElementById("orderDate").value = 'dd/mm/yyyy';
    // }else{
    getOrders(d)
    // }



}

function onLoad() {

    document.getElementById("orderList").style.opacity = "0";

    var client = new HttpClient();


    client.get('/pendingpayments', function (response) {
        // console.log(typeof response)
        var orderlist = JSON.parse(response);
        var noOfOrders = Object.size(orderlist);


        for (var i = 0; i < noOfOrders; i++) {
            // console.log('Response: ' + orderlist[i]["orderDate"]);
            var date = new Date(orderlist[i]["orderDate"]);
            orderlist[i]["orderDate"] = date.getHours().toFixed(0) + ":" + date.getMinutes() + "  " +
                ('0' + date.getDate()).slice(-2) + "/" + (parseInt((date.getMonth().toFixed(0))) + 1) + "/" + date.getFullYear().toFixed(0);
            // console.log("Date of order " + date.getDate() + " Date of selected: " + d.getDate())

        }
        // console.log(typeof noOfOrders);
        if (noOfOrders > 0) {


            // CREATE DYNAMIC TABLE.
            var table = document.createElement("table");
            table.setAttribute("class", "ver6");


            table.setAttribute("id", "table");
            table.setAttribute('border', '1');
            table.setAttribute('cellspacing', '0');
            table.setAttribute('cellpadding', '20');

            // retrieve column header ('Name', 'Email', and 'Mobile')

            var col = []; // define an empty array
            for (var i = 0; i < noOfOrders; i++) {
                for (var key in orderlist[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            // CREATE TABLE HEAD .
            var tHead = document.createElement("thead");


            // CREATE ROW FOR TABLE HEAD .
            var hRow = document.createElement("tr");
            hRow.setAttribute("class", "row100 head");

            // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = col[i];
                th.setAttribute("class", "column100 column" + (i + 1));
                hRow.appendChild(th);
            }
            var th = document.createElement("th");
            th.setAttribute("class", "column100 column" + (i + 1));
            th.innerHTML = "Paid?";
            hRow.appendChild(th);
            tHead.appendChild(hRow);
            table.appendChild(tHead);

            // CREATE TABLE BODY .
            var tBody = document.createElement("tbody");

            // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
            for (var i = 0; i < noOfOrders; i++) {

                var bRow = document.createElement("tr"); // CREATE ROW FOR EACH RECORD .
                bRow.setAttribute("class", "row100");


                for (var j = 0; j < col.length; j++) {
                    var td = document.createElement("td");
                    td.setAttribute("class", "column100 column" + (j));

                    td.innerHTML = orderlist[i][col[j]];
                    bRow.appendChild(td);



                }

                var td = document.createElement("td");
                td.setAttribute("class", "column100 column" + (col.length + 1));

                var button = document.createElement("button");
                button.innerHTML = "Update";
                td.appendChild(button);
                button.setAttribute('name', 'button' + i);
                button.setAttribute('onclick', 'setPaid(' + i + ',' + orderlist[i]["idorders"] + ')');
                button.style.color = "white";
                bRow.appendChild(td);
                tBody.appendChild(bRow)

                // if (i % 2 == 0) {
                //     td.parentElement.style.backgroundColor = "whitesmoke";
                // }

            }
            table.appendChild(tBody);


            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("tableContainer");
            divContainer.appendChild(table);

            sortTable();

        }

    });

    document.getElementById("orderList").style.opacity = "1";
    document.getElementById("orderList").style.width = "1800px";
    document.getElementById("orderList").style.padding = "42px 55px 45px 55px";



}

function setPaid(n, list) {


    var r = confirm("Are you sure they have paid?");
    if (r == true) {
        var xhr = new XMLHttpRequest();
        var url = "/updatePayments";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json.email + ", " + json.password);
            }
        };
        var data = JSON.stringify({ "idorders": list });
        xhr.send(data);
        location.reload();
    } else {

    }



}

function addBorder() {
    document.getElementById("close").style.border = 'solid';
    document.getElementById("close").style.borderColor = 'lightgray';
    document.getElementById("close").style.borderWidth = '1px';

}


function remBorder() {

    document.getElementById("close").style.borderColor = 'white';
}
Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("table");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[4];
            y = rows[i + 1].getElementsByTagName("TD")[4];
            // Check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}