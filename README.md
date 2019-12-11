# node-mysql

# Bamazon App

### Overview
<p>In this assignment we were tasked with building a Bamazon app. This app allows users to preview items for sale or purchase an item from the list of available items that are stored in a mysql database we created. The second part of the assignment was to create some manager functions to all the manager to keep tabs on the "business".</p>


### Customer option to buy items
<p>To access the following prompts you must type node bamazonCustomer.js</p>

#### Screenshot of this process

![Customer](./images/customer.jpg)

##### How it works

<p>To use this function you just arrow to the number that represents the item id that you want to purchase.</p>


![Customer](./images/customer2.jpg)
<p>You are then asked how many of that item you would like to purchase and it then tells you that your purchase was successful and how much the total is.</p>

![Customer](./images/customer3.jpg)
<p>In this screenshot you can see that the mysql database has been updated as now "Fridge" has 34 units available after the purchase of the 50 units.</p>



### Manager search commands
<p>To access these option you must enter node bamazonManager.js</p>

* Display the product info
* Check for items with low inventory
* Add to an items inventory
* Add a new item

#### Display the product info

<p>This option just logs a table for all the items in the database with their information</p>

![Manager](./images/manager.jpg)

<p>You then use the arrow key to navigate to the option you want. This example we use Display the product info.</p>

![Manager](./images/manager1.jpg)


#### Check for items with low inventory

<p>This option accesses the mysql database and returns any item that has a quantity of less than 5 on hand.</p>

![Manager](./images/manager2.jpg)


#### Add to an items inventory

<p>This option allows the manager to add to any items inventory in the mysql database.</p>

![Manager](./images/manager3.jpg)

<p>You are prompted to type in the item id of the item you want to add to the inventory of. You are then prompted how many would you like to add.</p>

![Manager](./images/manager4.jpg)

<p>We can now see the Ram item has had 1 unit added to the stock quantity.</p>


#### Add a new item

<p>This command allows the manager to add a new item to the database.</p>

![Manager](./images/manager5.jpg)

<p>The prompts ask you the name of the item, the department the item belongs, the price of the item, and the quantity of the item to be added.</p>

![Manager](./images/manager6.jpg)

<p>Now when you load up the mysql database you can see that the new item watch is in there with all the info we provided.</p>


