const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Bribrenbray1",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();

});
function runSearch() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Display the product info",
            "Check for items with low inventory",
            "Add to an items inventory",
            "Add a new item",
            "exit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "Display the product info":
                display();
                break;

            case "Check for items with low inventory":
                lowInventory();
                break;

            case "Add to an items inventory":
                addInventory();
                break;

            case "Add a new item":
                addItem();
                break;

            case "exit":
                connection.end();
                break;
        }
    })
}
function display() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("--------------------");
        console.log("ID | Product Name | Price | Quantity ");
        console.log("--------------------")

        for (let i = 0; i < results.length; i++) {
            console.log(results[i].item_id + " | " + results[i].product_name + " | " + "$" + results[i].price + " | " + results[i].stock_quantity);
        }
        runSearch();
    })
}

function lowInventory() {
    var query = "SELECT stock_quantity FROM products WHERE stock_quantity < 5 ";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log("--------------------");
        console.log("ID | Product Name | Price | Quantity ");
        console.log("--------------------")
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].item_id + " | " + results[i].product_name + " | " + "$" + results[i].price + " | " + results[i].stock_quantity);
        }
        runSearch();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id.toString()+ " | " + results[i].product_name.toString()+ " | " + results[i].stock_quantity.toString());
                    }
                    return choiceArray;
                },
                message: "What is the item ID of the item you would like to add to the inventory?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"
            }
        ]).then(function(answer){
            let selectedItem;
            for(let i = 0; i < results.length; i++){
                if(results[i].item_id === parseInt(answer.choice)){
                    selectedItem = results[i];

                    connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: selectedItem.stock_quantity + answer.quantity
                        },
                        {
                            item_id: selectedItem.item_id
                        }
                    ],
                    function(error){
                        if(error) throw err;
                        console.log("You have successfully added to the inventory.")
                        runSearch();
                    }
                    
                    )
                }
            }

            
        })
    })
}