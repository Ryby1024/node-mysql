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
    display();
    userBuy();

});
function display() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.table(results);        
    })
}


function userBuy() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id.toString());
                    }
                    return choiceArray;
                },
                message: "What is the item ID of the item you would like to purchase?",
                validate: function(userChoice){
                    if(!isNaN(userChoice)){
                        return true;
                    }
                    console.log(" Please enter a valid Item ID");
                    return false;
                }

            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function(userQ){
                    if(!isNaN(userQ)){
                        return true;
                    }
                    console.log(" Please enter a valid quantity");
                    return false;
                }
            }
        ]).then(function (answer) {
            let chosenItem;
            for (let i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.choice)) {
                    chosenItem = results[i];

                }

            }

            if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: chosenItem.stock_quantity - answer.quantity
                        },
                        {
                            item_id: chosenItem.item_id
                        }

                    ],
                    function (error) {
                        let totalAmount = chosenItem.price * answer.quantity;
                        if (error) throw err;
                        console.log("Purchase was successful! Your total is " + "$" + totalAmount);
                        connection.end();
                    }
                );

            } else {
            console.log("Not enough supply. Please try again.");
            setTimeout(display, 2000);
            setTimeout(userBuy, 4000);
            };

        });
    });
}