<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Items Display</title>
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
    <h1>Items List</h1>
    <div id="itemsContainer"></div>

    <script>
        fetch('/Orders/items.php?entity=items')
            .then(response => response.json())
            .then(data => {
                const itemsContainer = document.getElementById('itemsContainer');

                if (data.error) {
                    itemsContainer.innerHTML = `<p>${data.error}</p>`;
                } else if (data.length === 0) {
                    itemsContainer.innerHTML = '<p>No items found.</p>';
                } else {
                    data.forEach(item => {
                        const itemDiv = document.createElement('div');
                        itemDiv.innerHTML = `
                            <h3>${item.ItemName}</h3>
                            <p>Item Number: ${item.ItemNo}</p>
                            <p>Price: ${item.Price}</p>
                            <p>Category ID: ${item.CategoryID}</p>
                            <p>Item image:</p>
                            ${item.ItemImage ? `<img src="data:image/jpeg;base64,${item.ItemImage}" alt="${item.ItemName}"/>` : '<p>No image available.</p>'}
                        `;
                        itemsContainer.appendChild(itemDiv);
                    });
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    </script>
</body>
</html>
