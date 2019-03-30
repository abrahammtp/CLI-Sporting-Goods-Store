var mysql = require("mysql");

var inquirer = require("inquirer");

var Table = require("cli-table");

// var table = new Table ({
//     head: ['ID', 'Product Name', 'Department', 'Price', 'In Stock'],
//     colWidths: [6, 25, 25, 10, 10]
// });

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId);
    displayProducts();
    // connection.end()
})

function displayProducts() {
    console.log("========= Welcome to ATP Sporting Goods, where your sports are our purpose! =========");
    connection.query('SELECT * FROM `products`', function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'In Stock'],
            colWidths: [6, 25, 25, 10, 10]
        });
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, ' $ ' + res[i].price, res[i].stock_quantity]
            )
        }
        console.log(table.toString());
        beginPurchase()
    }
    )
}

function beginPurchase() {
    connection.query('SELECT * FROM `products`', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt({
                name: "itemSelection",
                type: "rawlist",
                message: "Select the item you would like to buy using the item's ID",
                choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            }).then(function (answer){
                if (answer.itemSelection === res.item_id) {
                    inquirer
                        .prompt({
                            name: "itemQuantity",
                            type: "input",
                            message: "Please, enter the quantity you wish to buy"
                        })
                }
                else{
                    connection.end();
                }
            })

    })
}