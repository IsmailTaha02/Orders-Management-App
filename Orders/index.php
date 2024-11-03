<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Test</title>
    <style>
        #itemsContainer img {
            max-width: 200px; /* Adjust width as needed */
            max-height: 200px; /* Adjust height as needed */
            width: auto;
            height: auto;
            display: block; /* Ensures the image doesn't stretch beyond its container */
            margin: 5 auto; /* Center the image horizontally */
            
        }
    </style>
</head>

<body>
    <h1>API Test</h1>

    <!-- Form for GET Request -->
    <h2>Get Customers</h2>
    <form action="/Orders/api.php" method="GET">
        <input type="hidden" name="entity" value="customers">
        <button type="submit">Get Customers</button>
    </form>

    <!-- Form for POST Request -->
    <h2>Add Customer</h2>
    <form action="/Orders/api.php?entity=customers" method="POST" enctype="multipart/form-data">
        <label for="CustomerName">Name:</label>
        <input type="text" id="CustomerName" name="CustomerName" required><br><br>
        <label for="CustomerMobile">Mobile:</label>
        <input type="text" id="CustomerMobile" name="CustomerMobile" required><br><br>
        <label for="CustomerAddress">Address:</label>
        <input type="text" id="CustomerAddress" name="CustomerAddress" required><br><br>
        <label for="CustomerImage">Customer image:</label>
        <input type="file" accept="image/*" id="CustomerImage" name="CustomerImage"> <br><br>  
        <button type="submit">Add Customer</button>
    </form>

    <!-- Form for PUT Request -->
    <h2>Update Customer</h2>
    <form action="/Orders/api.php?entity=customers" method="POST">
        <input type="hidden" name="_method" value="PUT">
        <label for="CustomerID">Customer ID:</label>
        <input type="number" id="CustomerID" name="CustomerID" required><br><br>
        <label for="CustomerName">Name:</label>
        <input type="text" id="CustomerName" name="CustomerName" required><br><br>
        <label for="CustomerMobile">Mobile:</label>
        <input type="text" id="CustomerMobile" name="CustomerMobile" required><br><br>
        <label for="CustomerAddress">Address:</label>
        <input type="text" id="CustomerAddress" name="CustomerAddress" required><br><br>
        <button type="submit">Update Customer</button>
    </form>

    <!-- Form for DELETE Request -->
    <h2>Delete Customer</h2>
    <form action="/Orders/api.php?entity=customers" method="POST">
        <input type="hidden" name="_method" value="DELETE">
        <label for="CustomerID">Customer ID:</label>
        <input type="number" id="CustomerID" name="id" required><br><br>
        <button type="submit">Delete Customer</button>
    </form>

    <br>
    <hr>

    <!-- Form for GET Request -->

    <h2>Get Items</h2>
    <form id="itemsForm" action="/Orders/display_items.php" method="GET">
        <input type="hidden" name="entity" value="items">
        <button type="submit">Get Items</button>
    </form>

    <!-- Form for POST Request -->
    <h2>Add Items</h2>
    <form action="/Orders/api.php?entity=items" method="POST" enctype="multipart/form-data">
        <label for="ItemName">Name:</label>
        <input type="text" id="ItemName" name="ItemName" required><br><br>
        <label for="Price">Price:</label>
        <input type="number" id="Price" name="Price" required><br><br>
        <label for="CategoryID">Category ID:</label>
        <input type="number" id="CategoryID" name="CategoryID" required><br><br>
        <label for="ItemImage">Item image:</label>
        <input type="file" accept="image/*" id="ItemImage" name="ItemImage"> <br><br>   
        <button type="submit">Add Item</button>
    </form>

    <!-- Form for PUT Request -->
    <h2>Update Item</h2>
    <form action="/Orders/api.php?entity=items" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="_method" value="PUT">
        <label for="ItemNo">Item number:</label>
        <input type="number" id="ItemNo" name="ItemNo" required><br><br>
        <label for="ItemName">Item Name:</label>
        <input type="text" id="ItemName" name="ItemName" required><br><br>
        <label for="Price">Price:</label>
        <input type="number" id="Price" name="Price" required><br><br>
        <label for="CategoryID">Category ID:</label>
        <input type="number" id="CategoryID" name="CategoryID" required><br><br>
        <label for="ItemImage">Item image:</label>
        <input type="file" accept="image/*" id="ItemImage" name="ItemImage"> <br><br>   
        <button type="submit">Update Item</button>
    </form>

    <!-- Form for DELETE Request -->
    <h2>Delete Item</h2>
    <form action="/Orders/api.php?entity=items" method="POST">
        <input type="hidden" name="_method" value="DELETE">
        <label for="ItemNo">Item number:</label>
        <input type="number" id="ItemNo" name="id" required><br><br>
        <button type="submit">Delete Item</button>
    </form>

    
    <br>
    <hr>

    <h2>Get Cart</h2>
    <form id="cartForm" action="/Orders/api.php" method="GET">
        <input type="hidden" name="entity" value="cart">
        <button type="submit">Get Cart</button>
    </form>

    <h2>Add Cart Item</h2>
    <form action="/Orders/api.php?entity=cart" method="POST">
        <label for="OrderCode">Order Code:</label>
        <input type="text" id="OrderCode" name="OrderCode" required><br><br>

        <label for="CustomerID">Customer ID:</label>
        <input type="number" id="CustomerID" name="CustomerID" required><br><br>

         <label for="ItemNo">Item No:</label>
        <input type="number" id="ItemNo" name="ItemNo" required><br><br>

        <label for="Quantity">Quantity:</label>
        <input type="number" id="Quantity" name="Quantity" required><br><br>

        <label for="Price">Price:</label>
        <input type="text" id="Price" name="Price" required><br><br>

        <label for="Amount">Amount:</label>
        <input type="text" id="Amount" name="Amount" required><br><br>

        <label for="DateAdded">Date Added:</label>
        <input type="datetime-local" id="DateAdded" name="DateAdded" required><br><br>

        <button type="submit">Add Cart Item</button>
    </form>

    <h2>Delete Cart Item</h2>
    <form action="/Orders/api.php?entity=cart" method="POST">
        <input type="hidden" name="_method" value="DELETE">
        <label for="OrderCode">Order Code:</label>
        <input type="text" id="OrderCode" name="id" required><br><br>
        <button type="submit">Delete Cart Item</button>
    </form>

    <br>
    <hr>


    <h2>Get Orders</h2>
<form id="cartForm" action="/Orders/api.php" method="GET">
    <input type="hidden" name="entity" value="orders">
    <button type="submit">Get Orders</button>
</form>

<h2>Add Order</h2>
<form action="/Orders/api.php?entity=orders" method="POST">

    <label for="CustomerID">Customer ID:</label>
    <input type="number" id="CustomerID" name="CustomerID" required><br><br>

    <label for="ItemNo">Item No:</label>
    <input type="number" id="ItemNo" name="ItemNo" required><br><br>

    <label for="Quantity">Quantity:</label>
    <input type="number" id="Quantity" name="Quantity" required><br><br>

    <label for="Amount">Amount:</label>
    <input type="text" id="Amount" name="Amount" required><br><br>

    <button type="submit">Add Order</button>
</form>

<h2>Delete Order</h2>
<form action="/Orders/api.php?entity=orderdetails" method="POST">
    <input type="hidden" name="_method" value="DELETE">
    <label for="OrderID">Order ID:</label>
    <input type="number" id="OrderID" name="id" required><br><br>
    <button type="submit">Delete Order Item</button>
</form>


</body>

</html>
