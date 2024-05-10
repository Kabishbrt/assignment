//==================================index.js==================================//

var debug = false;
var authenticated = false;


$(document).ready(function () {

	localStorage.removeItem("allUsers");
	localStorage.removeItem("allOrders");
	
	
	if (!localStorage.allUsers) {
	  
		if (debug) alert("Users not found - creating a default user!");
		
		var userData = {email:"admin@domain.com",password:"admin",firstName:"CQU",lastName:"User",state:"QLD",phoneNumber:"0422919919", address:"700 Yamba Road", postcode:"4701"};
		
		var allUsers = [];
		allUsers.push(userData); 
		
		if (debug) alert(JSON.stringify(allUsers));  
		localStorage.setItem("allUsers", JSON.stringify(allUsers));

	} else {
        
		if (debug) alert("Names Array found-loading.."); 		
		
		var allUsers = JSON.parse(localStorage.allUsers);    
		if (debug) alert(JSON.stringify(allUsers));
	} 



	/**
	----------------------Event handler to process login request----------------------
	**/
	
	$('#loginButton').click(function () {
		// Remove stored token (if any)
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
	
		// Create login data object
		var loginData = {
			email: $("#email").val(),
			password: $("#password").val()
		};
		// Send login request to server
		showLoading();
		$.ajax({
			type: "POST",
			url: "http://localhost:3000/api/users/login",
			data: JSON.stringify(loginData), // Convert loginData object to JSON
			contentType: 'application/json', // Set content type to JSON
			success: function(response) {
				hideLoading();
				// Login successful
				localStorage.setItem("token", response.token);
				localStorage.setItem("userId", response.userId);
				localStorage.setItem("email", response.email);
				// alert("Login successful!");
				$.mobile.changePage("#homePage");
			},
			error: function(xhr, status, error) {
				hideLoading();
				alert("Login failed. Please try again.");
				console.error("Error:", error);
			}
		});
	
		// Reset login form
		$("#loginForm").trigger('reset');
	});
	

	 $("#loginForm").validate({// JQuery validation plugin
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var inputData = {};
			formData.forEach(function(data){
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));		
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {	
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	});
	
	
	$(document).on("pagebeforeshow", "#signuppage", function() {
		$("#signupbutton").on("click", function() {
			if ($("#signupform").valid()) {
				showLoading();
				var formData = $("#signupform").serializeArray();
				
				var userData = {};
				formData.forEach(function(field) {
					userData[field.name] = field.value;
				});
					
				$.ajax({
					type: "POST",
					url: "http://localhost:3000/api/users/signup",
					contentType: "application/json",
					data: JSON.stringify(userData), // Pass userData directly
					success: function(response) {
						hideLoading();
						// Registration successful
						localStorage.setItem("token", response.token);
						localStorage.setItem("userId", response.userId);
						localStorage.setItem("email", response.email);
						alert("Registration successful!");
						$("#signupform")[0].reset();
						$.mobile.changePage("#homePage");
					},
					error: function(xhr, status, error) {
						hideLoading();
						// Registration failed
						var errorMessage = "Registration failed. Please try again later.";
						if (xhr.responseJSON && xhr.responseJSON.message) {
							errorMessage = xhr.responseJSON.message;
						}
						alert(errorMessage);
						console.error("Error:", error);
					}
				});
			}
		});
	});

	function showLoading() {
		$("#loadingIndicator").show();
	}
	
	// Function to hide loading indicator
	function hideLoading() {	
		$("#loadingIndicator").hide();
	}

	
	$("#signupform").validate({  
		focusInvalid: false, 
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var Info = {};

			formData.forEach(function(data){
				Info[data.name] = data.value;
			});
			
			var userInfo = JSON.parse(localStorage.getItem("userInfo"));

			Info.customerfName = userInfo.firstName;
			Info.customerlName = userInfo.lastName;
			
			localStorage.setItem("orderInfo", JSON.stringify(Info));

			if (debug)	alert(JSON.stringify(Info));
			
					
		},
		
		/* validation rules */
		
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {	
				required: true,
				rangelength: [3, 10]
			},
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
		},
		/* Validation Message */

		messages: {
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {	
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
				
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		}
	});
	/**
	--------------------------end--------------------------
	**/	


	$(document).on("pagebeforeshow", "#loginPage", function() {
		$("#logoutLink").on("click", function() {
			// Remove token from localStorage
			localStorage.removeItem("token");
			localStorage.removeItem("userId");
			localStorage.removeItem("email");
			$.mobile.changePage("#loginPage");
		});
	});



	/**
	------------Event handler to respond to selection of gift category-------------------
	**/
	$('#itemList li').click(function () {
		
		var itemName = $(this).find('#itemName').text()
		var itemPrice = $(this).find('#itemPrice').text()
		var itemImage = $(this).find('#itemImage').attr('src');
		
		localStorage.setItem("itemName", itemName);
		localStorage.setItem("itemPrice", itemPrice);
		localStorage.setItem("itemImage", itemImage);

	}) 

	/**
	--------------------------end--------------------------
	**/	

	$(document).on("pagebeforeshow", "#selectPage", function() {
		// Fetch books data from the provided endpoint
		$.get('http://localhost:3000/api/books/', function(data) {
			// Clear existing list items
			$('#itemList').empty();
	
			// Iterate through each book and create list items to display them
			$.each(data, function(index, book) {
				// Create list item
				var listItem = $('<li>');
	
				// Create anchor tag
				var anchor = $('<a>').attr('href', '#fillOrderPage');
	
				// Create image tag
				var image = $('<img>').attr('src', book.image);
				anchor.append(image);
	
				// Create div for text content
				var div = $('<div>');
	
				// Create heading with book title
				var heading = $('<h3>').text(book.title);
				div.append(heading);
	
				// Create paragraph for author and condition
				var paragraph = $('<p>').css({'font-size': '10px', 'line-height': '1.2', 'margin': '0'});
				paragraph.append('Author: ' + book.author + '<br>');
				paragraph.append('Condition: ' + book.condition + '<br>');
				
				// Check if userId exists before appending username
				if (book.userId && book.userId.username) {
					paragraph.append('Username: ' + book.userId.username);
				}
	
				div.append(paragraph);
	
				// Append div to anchor
				anchor.append(div);
	
				// Append anchor to list item
				listItem.append(anchor);
	
				// Append list item to the list
				$('#itemList').append(listItem);
	
				// Add click event listener to store details in session storage when item is clicked
				anchor.click(function() {
					// Store details of clicked item in session storage
					sessionStorage.setItem('clickedItemTitle', book.title);
					sessionStorage.setItem('clickedItemImage', book.image);
					sessionStorage.setItem('clickedItemAuthor', book.author);
					sessionStorage.setItem('clickedItemCondition', book.condition);
					sessionStorage.setItem('clickedItemUsername', book.userId ? book.userId.username : '');
					sessionStorage.setItem('clickedItemEmail', book.userId ? book.userId.email : '');
				});
			});
		}).fail(function() {
			console.error('Error fetching books');
		});
	});
	
	

	/**
	--------------------Event handler to process order confirmation----------------------
	**/

	$('#confirmOrderButton').on('click', function () {
		
		localStorage.removeItem("orderInfo");

		$("#orderForm").submit();

		if (localStorage.orderInfo != null) {

			var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));

			var allOrders = [];

			if (localStorage.allOrders != null) 
				allOrders = JSON.parse(localStorage.allOrders); 

			allOrders.push(orderInfo);

			localStorage.setItem("allOrders", JSON.stringify(allOrders));

			if (debug) alert(JSON.stringify(allOrders));			

			$("#orderForm").trigger('reset');
			
			$.mobile.changePage("#confirmPage");
		}	
	})


	$("#orderForm").validate({  
		focusInvalid: false, 
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var orderInfo = {};

			formData.forEach(function(data){
				orderInfo[data.name] = data.value;
			});
			
			orderInfo.item = localStorage.getItem("itemName")
			orderInfo.price = localStorage.getItem("itemPrice")
			orderInfo.img = localStorage.getItem("itemImage")
			
			var userInfo = JSON.parse(localStorage.getItem("userInfo"));

			orderInfo.customerfName = userInfo.firstName;
			orderInfo.customerlName = userInfo.lastName;
			
			localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

			if (debug)	alert(JSON.stringify(orderInfo));
					
		},
		
		/* validation rules */
		
		rules: {
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
		},
		/* Validation Message */

		messages: {
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
				validateName: true
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},
		}
	});




	/**
	--------------------Event handler to perform initialisation before login page is displayed--------------------
	**/


	$(document).on("pagebeforeshow", "#loginPage", function() {
	
		localStorage.removeItem("userInfo");
	
		authenticated = false;
	});  
	
	/**
	--------------------------end--------------------------
	**/	

	/**
	--------------------Event handler to populate the fill order page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#fillOrderPage", function() {
		// Retrieve stored details from session storage
		var email = sessionStorage.getItem('email');
		var clickedItemTitle = sessionStorage.getItem('clickedItemTitle');
		var clickedItemAuthor = sessionStorage.getItem('clickedItemAuthor');
		var clickedItemCondition = sessionStorage.getItem('clickedItemCondition');
		var clickedItemUsername = sessionStorage.getItem('clickedItemUsername');
		var clickedItemEmail= sessionStorage.getItem('clickedItemEmail');
		var clickedItemImage= sessionStorage.getItem('clickedItemImage');
	
		// Display the retrieved details on the page
// Populate the #itemDetails element with book item information
	$('#itemDetails').html(`
		<h2>Book Details</h2>
		<p><strong>Title:</strong> ${clickedItemTitle}</p>
		<p><strong>Author:</strong> ${clickedItemAuthor}</p>
		<p><strong>Condition:</strong> ${clickedItemCondition}</p>
		<p><strong>Username:</strong> ${clickedItemUsername}</p>
		<p><strong>Email:</strong> ${clickedItemEmail}</p>
	`);

	$('#itemDetails').append(`<img src="${clickedItemImage}" height="300" width="300" alt="Book Image">`);
	
	$('#sendRequest').on('click', function() {
        const description = $('#description').val();
        const sender = localStorage.getItem('email');
        const emailData = {
            "useremail": clickedItemEmail,
            "subject": `Book Request from ${sender}`,
            "body": description
        };
        showSending();
        $.ajax({
            url: "http://localhost:3000/api/mail",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(emailData),
            success: function(response) {
                hideSending();
                alert("Email sent successfully:", response);
            },
            error: function(xhr, status, error) {
                hideSending();
                alert("Error sending email:", error);
            }
        });
    });

	});
	function showSending() {
		// Display a loading spinner or a message indicating that the email is being sent
		// For example:
		$('#sendingMessage').text("Sending email..."); // Add a message
	}
	
	// Function to hide sending message/loading spinner
	function hideSending() {
		// Hide the loading spinner and clear the sending message
		// For example:
		$('#sendingMessage').text(""); // Clear the message
	}
	

	/**
	--------------------------end--------------------------
	**/	


	/**
	--------------------Event handler to populate the confirm page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#confirmPage", function() {
		
		$('#orderConfirmation').html("");

		if (localStorage.orderInfo != null) {

			var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));

			$('#orderConfirmation').append('<br><table><tbody>');
			$('#orderConfirmation').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + orderInfo.customerfName + ' ' + orderInfo.customerlName + '</span></td></tr>');	
			$('#orderConfirmation').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');	
			$('#orderConfirmation').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr>');
			$('#orderConfirmation').append('</tbody></table><br>');
		}
		else {
			$('#orderConfirmation').append('<h3>There is no order to display<h3>');
		}
	});  

	

	$(document).on("pagebeforeshow", "#PastOrdersPage", function() {
    
		$('#pastorders').html("");
		
		if (localStorage.allOrders != null) {
			var allOrders = JSON.parse(localStorage.getItem("allOrders"));
			console.log(allOrders)
		
			if (allOrders.length > 0) {
				$('#pastorders').append('<br><table><tbody>');
		
				allOrders.forEach(function(orderInfo, index) {
					$('#pastorders').append('<tr><td>Order No. : </td><td><span class=\"fcolor\">' + (index+1001) + '</span></td></tr>');
					$('#pastorders').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + orderInfo.customerfName + ' ' + orderInfo.customerlName + '</span></td></tr>');   
					$('#pastorders').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');   
					$('#pastorders').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
					$('#pastorders').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
					$('#pastorders').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
					$('#pastorders').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
					$('#pastorders').append('<tr><td>Dispatch Date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr>');
					$('#pastorders').append('<tr><td colspan="2"></td></tr>');
					$('#pastorders').append('<br>');
				});
		
				$('#pastorders').append('</tbody></table>');
			} else {
				$('#pastorders').append('<h3>There are no orders to display</h3>');
			}
		} else {
			$('#pastorders').append('<h3>No orders found</h3>');
		}
	});

	$(document).on("pagebeforeshow", "#UserPage", function() {
		// Clear existing content inside #userdetail
		$('#userdetail').html("");
		const userId = localStorage.getItem('userId');
		// Make AJAX request to fetch user data
		showLoading();
		$.ajax({
			url: `http://localhost:3000/api/users/${userId}`,
			method: 'GET',
			success: function(response) {
				hideLoading();
				// Append fetched data to #userdetail
				$('#userdetail').append(
					"<p>Username: " + response.username + "</p>" +
					"<p>Email: " + response.email + "</p>" +
					"<p>City: " + response.city + "</p>" +
					"<p>Street: " + response.street + "</p>"
				);
			},
			error: function(xhr, status, error) {
				hideLoading();
				console.error("Error fetching user data:", error);
			}
		});
	});


	
	
	$(document).on("pagebeforeshow", "#myBooksPage", function () {
		const userId = localStorage.getItem("userId");
		$.ajax({
			url: `http://localhost:3000/api/books/user/${userId}`,
			type: "GET",
			success: function (books) {
				var tableBody = $("#mybookList");
				tableBody.empty(); // Clear existing table body
				if (books && books.length > 0) {
					books.forEach(function (book) {
						// Append each book as a table row
						var tableRow = "<tr>";
						tableRow += "<td>" + book.title + "</td>";
						tableRow += "<td>" + book.author + "</td>";
						tableRow += "<td>" + book.condition + "</td>";
						tableRow += "<td><img src='" + book.image + "' alt='Book Cover' style='max-width:50px'></td>";
						tableRow += "<td><button class='delete-button' data-id='" + book._id + "'>Delete</button></td>";
						tableRow += "</tr>";
						tableBody.append(tableRow);
					});
				} else {
					tableBody.append("<tr><td colspan='5'>No books found</td></tr>");
				}
			},
			error: function (xhr, status, error) {
				console.log("Error fetching books:", error);
			}

			
		});

		$(document).on("click", ".delete-button", function (e) {
            e.preventDefault();
            var bookId = $(this).data("id");
            if (confirm("Are you sure you want to delete this book?")) {
                $.ajax({
                    url: `http://localhost:3000/api/books/${bookId}`,
                    type: "DELETE",
                    success: function (response) {
                        // Remove the deleted book from the table
                        $(this).closest("tr").remove();
                        alert("Book deleted successfully!");
						location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.log("Error deleting book:", error);
                        alert("Error deleting book. Please try again later.");
                    }
                });
            }
        });
	});

	
	


	/**
	--------------------------end--------------------------
	**/	

	

});


