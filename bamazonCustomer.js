var mysql = require("mysql");

var inquirer = require("inquirer");

var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
})

connection.connect(function (err) {
    if (err) throw err;
    displayProducts();
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
        ifShopping()
    }
    )
}

function ifShopping() {
    inquirer
        .prompt({
            name: "shopping",
            type: "list",
            message: "Would you like to shop for an item?",
            choices: [
                "Yes", "No"
            ]
        }).then(function (answer) {
            switch (answer.shopping) {
                case "Yes":
                    beginPurchase();
                    break;

                case "No":
                    connection.end();
                    break;
            }
        });
}

function beginPurchase() {
    inquirer
        .prompt([
            {
            name: "item_id",
            type: "input",
            message: "Select the item you would like to buy using the item's ID",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name: "quantity",
            type: "input",
            message: "Please, enter the quantity you would like to buy",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function (answer) {
            var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: answer.item_id },
            function(err, res) {
                if (err) throw err;
                var selectResult = res;
                if (answer.quantity <= selectResult[0].stock_quantity) {
                console.log("\n");
                console.log("You have selected: " + res[0].product_name + " for a total of $ " + res[0].price*answer.quantity);
                var query = "UPDATE products SET ? WHERE ?";
                connection.query(query, [
                    {
                        stock_quantity: selectResult[0].stock_quantity - answer.quantity
                    },
                    {
                        item_id: answer.item_id
                    }
                ],
                    function(err, res) {
                        console.log("\n");
                        console.log("Thank you for your purchase, we hope to see you soon!");
                        console.log("\n");
                        displayProducts();
                    }
                    )
                } else {
                    console.log("\n");
                    console.log("I am sorry, we do not have enough items in stock. Please select a different product");
                    console.log("\n");
                    displayProducts();
                }

            }
            );

        })
}
