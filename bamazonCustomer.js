var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Bribrenbray1",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  userBuy();
  connection.end();
});



function userBuy() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    inquirer.prompt([
        {
        name: "choice",
        type: "rawlist",
        choices: function(){
            var choiceArray = [];
            for(let i = 0; i < results.length; i++ ){
                choiceArray.push("\n" +"Item ID: " + results[i].item_id + " "+ "Item Name: " + results[i].product_name + " "+ "Item Price: " + results[i].price);
            }
            return choiceArray;
        },
        message: "What is the item ID of the item you would like to purchase?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
    }
    ]).then(function(answer){
        let chosenItem;
        for(let j = 0; j < results.length; j++){
            if(results[j].item_id === answer.choice){
                chosenItem = results[j];

            }

        }
        if(chosenItem.stock_quantity > parseInt(answer.quantity)){
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                {
                    stock_quantity: stock_quantity - answer.quantity
                },
                {
                    item_id: chosenItem.item_id
                }

                ],
                function(error){
                    if(error) throw err;
                    console.log("Purchase was successful! Your total is " + answer.quantity * answer.price);
                    userBuy();

                    
                }
            );

        }else{
            console.log("Not enough supply. Please try again.");
            userBuy();
        }
    })
  });
}