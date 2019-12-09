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
    var query = "SELECT * FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        
        var resArr = [];
        for (let i = 0; i < results.length; i++) {
            if(results[i].stock_quantity < 5)
            resArr.push(results[i].item_id + " | " + results[i].product_name + " | " + "$" + results[i].price + " | " + results[i].stock_quantity);
        }
        console.table(resArr);
        runSearch();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "choice",
                type: "input",
                choices: function () {
                    
                    for (let i = 0; i < results.length; i++) {
                        console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].stock_quantity)
                    }
                    
                },
                message: "What is the item ID of the item you would like to add to the inventory?",
                validate: function(inputChoice){
                    if(!isNaN(inputChoice)){
                        return true;
                    }
                    console.log(" Please enter a valid Item ID")
                    return false;
                }
               
            },
            {
                name: "quantity",
                type: "number",
                message: "How many would you like to add?",
                validate: function(inputQuant){
                    if(!isNaN(inputQuant)){
                        return true;
                    }
                    console.log(" Please enter a valid quantity.")
                    return false;
                }
                
            }
        ]).then(function (answer) {
            let selectedItem;
            for (let i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.choice)) {
                    selectedItem = results[i];

                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: parseInt(selectedItem.stock_quantity) + parseInt(answer.quantity)
                            },
                            {
                                item_id: selectedItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("You have successfully added to the inventory.")
                            setTimeout(runSearch, 3000);
                        }

                    )
                }
            }


        })
    })
}

function addItem() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.table(results);

        inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the item you want to add to the database?"
            },
            {
                name: "department",
                type: "input",
                message: "What department is this item in?"
            },
            {
                name: "price",
                type: "number",
                message: "What is the price of the item?",
                validate: function(inputPrice){
                    if(!isNaN(inputPrice)){
                        return true;
                    }
                    console.log(" Please enter a valid price");
                    return false;
                }
            },
            {
                name: "quantity",
                type: "number",
                message: "How many of this item do you want to add to the inventory?",
                validate: function(inputQuantity){
                    if(!isNaN(inputQuantity)){
                        return true;
                    }
                    console.log(" Please enter a valid quantity");
                    return false;
                }
            }
        ]).then(function(answer){             
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",[answer.name,answer.department,answer.price,answer.quantity], function(error, res){
                if(error) throw err;
                console.log("You have successfully added this item.")
                runSearch();
            })
        })
    })
}