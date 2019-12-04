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
  display();
  userBuy();
  
});

function display(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
   
   var choiceArray = [];
   for(let i = 0; i < results.length; i++ ){
       choiceArray.push("\n" +"Item ID: " + results[i].item_id + " "+ "Item Name: " + results[i].product_name + " "+ "Item Price: " + results[i].price);
   }
   console.log(choiceArray.toString());
})
}

function userBuy() {

    inquirer.prompt([
        {
        name: "choice",
        type: "input",
        message: "What is the item ID of the item you would like to purchase?"
        }
    ]).then(function(answer){
        let selection = answer.choice;
        connection.query("SELECT * FROM products WHERE item_id=?", selection,  function(err, results) {
            if(err) throw err;
            if(results.length === 0){
                console.log("That item does not exist. Please select an item ID from the options given");
                userBuy();
            }else{
                inquirer.prompt({
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to purchase?"
                }).then(function(answer1){
                    let quantity = answer1.quantity;
                    if(quantity > results[0].stock_quantity){
                        console.log("We are sorry, supplies are limited. Please try again.");
                        userBuy();
                    }else{
                        console.log("");
                        console.log(results[0].product_name + " purchased.");
                        console.log("Your total is " + parseInt(answer1.quantity) * parseInt(answer1.price))

                        let newTotalItems = results[0].stock_quantity - quantity;
                        connection.query("UPDATE products SET stock_quantity=? " + newTotalItems + "WHERE item_id=? " + results[0].item_id,
                        function(err, resUpdate){
                            if(err) throw err;
                            console.log("Your order has been processed")
                            connection.end();
                        })

                       
                    }
                })
            }
            
    })
  });
}