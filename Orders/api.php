<?php
include('config.php');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$entity = $_GET['entity'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

if (!$entity) {
    echo json_encode(["error" => "Entity parameter is missing"]);
    exit;
}

switch ($method) {
    case 'GET':
        handleGet($conn, $entity);
        break;
        
    case 'POST':
        $input = $_POST;
        if (isset($input['_method'])) {
            $overrideMethod = strtoupper($input['_method']);
            if ($overrideMethod == 'PUT') {
                handlePut($conn, $entity, $input, $_FILES);
            } elseif ($overrideMethod == 'DELETE') {
                handleDelete($conn, $entity, $input);
            } else {
                echo json_encode(['error'=> 'Unsupported method']);
            }
        } else {
            handlePost($conn, $entity, $_POST, $_FILES);
        }
        break;

    default:
        echo json_encode(["error" => "Unsupported method"]);
        break;
}

function handleGet($conn, $entity) {
    $search = $_GET['search'] ?? ''; // Retrieve search term if provided

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
    }

    if ($entity == "orders")
        $entity = "orderdetails";

    if ($entity == "cart"){
        $sql = "SELECT OrderCode,CustomerID,i.ItemNo, ItemImage,ItemName, Price, Quantity, Amount FROM items i, cart c where i.ItemNo = c.ItemNO and CustomerID = $id ";
        $stmt = $conn->prepare($sql);
        $stmt = $conn->query($sql);
    }

    else if ($entity == "orderdetails"){
        $sql = "SELECT ItemImage,ItemName,OrderID, Price, Quantity, Amount,OrderDate FROM items i, orderdetails o where i.ItemNo = o.ItemNO and CustomerID = $id";
        $stmt = $conn->prepare($sql);
        $stmt = $conn->query($sql);
    }

    else if ($entity === 'customers' && $search !== '') {
        // Search query for customers
        $sql = "SELECT * FROM Customers WHERE CustomerName LIKE :search";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':search' => "%$search%"]);
    } else {
        $table = ucfirst($entity);
        $sql = "SELECT * FROM $table";
        $stmt = $conn->query($sql);
    }
    
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Encode the image data to base64 if it exists
    foreach ($data as &$item) {
        if (isset($item['ItemImage']) && $item['ItemImage']) {
            $item['ItemImage'] = base64_encode($item['ItemImage']);
        }
    }
    unset($item);

    foreach ($data as &$customer) {
        if (isset($customer['CustomerImage']) && $customer['CustomerImage']) {
            $customer['CustomerImage'] = base64_encode($customer['CustomerImage']);
        }
    }
    unset($customer); // Unset reference to avoid potential issues

    echo json_encode($data);
}

function handlePost($conn, $entity, $input, $files) {

    if ($entity == "orders")
       $entity = "orderdetails";

    if ($entity === 'items') {
        try {
            // Prepare SQL statement
            $stmt = $conn->prepare("INSERT INTO Items (ItemName, Price, ItemImage) VALUES (?, ?, ?)");

            // Bind parameters
            $stmt->bindParam(1, $input['ItemName']);
            $stmt->bindParam(2, $input['Price']);

            if (isset($files['ItemImage']) && $files['ItemImage']['size'] > 0) {
                $image = file_get_contents($files['ItemImage']['tmp_name']);
                $stmt->bindParam(3, $image, PDO::PARAM_LOB);
            } else {
                $stmt->bindValue(3, null, PDO::PARAM_NULL);
            }

            // Execute the statement
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Item added successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to add item']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'General error: ' . $e->getMessage()]);
        }
    
    } else if ($entity === 'customers') {
        try {
            // Prepare SQL statement
            $stmt = $conn->prepare("INSERT INTO customers (CustomerName,CustomerMobile,CustomerAddress,CustomerImage) VALUES (?, ?, ?, ?)");

            // Bind parameters
            $stmt->bindParam(1, $input['CustomerName']);
            $stmt->bindParam(2, $input['CustomerMobile']);
            $stmt->bindParam(3, $input['CustomerAddress']);

            if (isset($files['CustomerImage']) && $files['CustomerImage']['size'] > 0) {
                $image = file_get_contents($files['CustomerImage']['tmp_name']);
                $stmt->bindParam(4, $image, PDO::PARAM_LOB);
            } else {
                echo "Asd";
                $stmt->bindValue(4, null, PDO::PARAM_NULL);
            }

            // Execute the statement
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Customer added successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to add customer']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'General error: ' . $e->getMessage()]);
        }    

    } else {
        $table = ucfirst($entity);
        $columns = implode(", ", array_keys($input));
        $values = ":" . implode(", :", array_keys($input));
        $sql = "INSERT INTO $table ($columns) VALUES ($values)";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute($input))
            echo json_encode(["success" => true, 'message' =>"$entity added successfully"]);
        else    
            echo json_encode(["success"=> false, "message"=> "Failed to add $entity"]);

    }
}

function handlePut($conn, $entity, $input, $files) {
    if ($entity === 'items') {
        $stmt = $conn->prepare("UPDATE Items SET ItemName = ?, Price = ?, CategoryID = ?, ItemImage = ? WHERE ItemNo = ?");
        $stmt->bindParam(1, $input['ItemName']);
        $stmt->bindParam(2, $input['Price']);
        $stmt->bindParam(3, $input['CategoryID']);

        if (isset($files['ItemImage']) && $files['ItemImage']['size'] > 0) {
            $image = file_get_contents($files['ItemImage']['tmp_name']);
            $stmt->bindParam(4, $image, PDO::PARAM_LOB);
        } else {
            $stmt->bindValue(4, null, PDO::PARAM_NULL);
        }

        $stmt->bindParam(5, $input['ItemNo']);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, 'message' => "Item updated successfully"]);
        } else {
            echo json_encode(["success"=> false, "message"=> "No changes were made to the item"]);
        }

    } else if ($entity === 'customers') {
        $stmt = $conn->prepare("UPDATE Customers SET CustomerName = ?, CustomerMobile = ?, CustomerAddress = ?, CustomerImage = ? WHERE CustomerID = ?");
        $stmt->bindParam(1, $input['CustomerName']);
        $stmt->bindParam(2, $input['CustomerMobile']);
        $stmt->bindParam(3, $input['CustomerAddress']);

        if (isset($files['CustomerImage']) && $files['CustomerImage']['size'] > 0) {
            $image = file_get_contents($files['CustomerImage']['tmp_name']);
            $stmt->bindParam(4, $image, PDO::PARAM_LOB);
        } else {
            $stmt->bindValue(4, null, PDO::PARAM_NULL);
        }

        $stmt->bindParam(5, $input['CustomerID']);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, 'message' => "Customer updated successfully"]);
        } else {
            echo json_encode(["success"=> false, "message"=> "No changes were made to the customer"]);
        }
    

    } else {
        $table = ucfirst($entity);
        $idField = ucfirst(rtrim($entity, 's')) . "ID";
        $id = $input[$idField];
        unset($input[$idField], $input['_method']);
        $columns = implode(" = ?, ", array_keys($input)) . " = ?";
        $sql = "UPDATE $table SET $columns WHERE $idField = ?";
        $stmt = $conn->prepare($sql);
        try {
             $stmt->execute([...array_values($input), $id]);
             $rowsAffected = $stmt->rowCount();
            if ($rowsAffected > 0) {
                 echo json_encode(["success" => true, "message" => "$entity updated successfully"]);
            } else {
                 echo json_encode(["success" => false, "message" => "No changes were made to the $entity"]);
         }
         
        } catch (PDOException $e) {
             echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }

    }
}

function handleDelete($conn, $entity, $input) {
    $id = $input['id'] ?? null;
    $table = $entity;
    $deleteAll = isset($input['deleteAll']) ? filter_var($input['deleteAll'], FILTER_VALIDATE_BOOLEAN) : false;
    
    if (!$id && !$deleteAll) {
        echo json_encode(["success" => false, "message" => "ID parameter is missing"]);
        return;
    }

    if($deleteAll){
        $sql = "DELETE from $table"; 
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "All items deleted successfully"]);
    }

    else{    
        $key = "CustomerID";

        if($table == "items")
            $key = "ItemNo";
        elseif($table == "cart")
            $key = "OrderCode";
        elseif($table == "orderdetails") 
            $key ="OrderID";   
        
        $sql = "DELETE FROM $table WHERE $key = :id"; 
        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $id]);
     

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "message" => "Record deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "No record found with the provided ID"]);
        }
    
    }
}
?>
