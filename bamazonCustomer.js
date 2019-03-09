
require('dotenv').config()
const mysql = require('mysql');
const keys = require("./keys.js");

//const prompts = require('prompts');
//show all data.



let inquirer = require('inquirer');
let con = mysql.createConnection(keys.AccessMysql);

con.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    connectedMySql();
});

connectedMySql = (con, function (err) {
    if (err) { throw err };

    //created intial database//

    // con.query("DROP DATABASE IF EXISTS bamazon;", function (err, result) {
    //     if (err) { throw err };
    //     console.log("Database DELETED" + result);
    // });

    // con.query("CREATE DATABASE bamazon;", function (err, result) {
    //     if (err) { throw err };
    //     console.log("Database CREATE" + result);
    // });

    //     con.query(");"
    // , function (err, result) {
    //     if (err) { throw err };
    //     console.log('CREATE TABLES' + result);
    // });

    displayInventory();
    runSearch();



});
function displayInventory() {
    var queryAll = "SELECT * FROM bamazon.products;"
    con.query(queryAll, function (err, result) {
        if (err) { throw err };
        console.log(result);
    });

};

//The first should ask them the ID of the product they would like to buy.
function runSearch() {
    
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter the Item_ID which you would like to purchase.',
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Total qauntity?',
            filter: Number
        }
    ]).then(function (input) {

            //The second message should ask how many units of the product they would like to buy.
        let item = input.item_id;
        let quantity = input.quantity;
        let queryStr = 'SELECT * FROM bamazon.products WHERE ?;';

        con.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw err;
            if (data.length === 0 || data.length === 1) {
                console.log('No Data Found!');
                displayInventory();

            } else {
                let productData = data[0];
                if (quantity <= productData.stock_quantity) {
                    console.log('console log  ' + productData.stock_quantity);
                    let updateQueryStr = 'UPDATE bamazon.products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                    con.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productData.price * quantity);

                        con.end();
                    })
                } else {
                    //console log 
                    console.log('Sorry,Insufficient quantity!', 'Available Inventory Stock:  ' + productData.stock_quantity);


                    let userQueryStr = "SELECT * FROM bamazon.products WHERE item_id = "+item+";";
                    con.query(userQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log(data);
                       // displayInventory(); //if there isn't enough
                    })
                }
            }
        })
    })
}
