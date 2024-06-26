//==================================index.js==================================//

var debug = false;
var authenticated = false;


$(document).ready(function () {

	

	$(document).on("pagecontainerchange", function() {
        checkExpiryAndRedirect();
    });

    // Placeholder function to check expiry and redirect
    function checkExpiryAndRedirect() {
        var expiryTimestamp = localStorage.getItem("expiry");
        var currentTimestamp = Date.now();
        if (expiryTimestamp && currentTimestamp > expiryTimestamp) {
			
			localStorage.removeItem("token");
			localStorage.removeItem("userid");
			localStorage.removeItem("email");
			localStorage.removeItem("expiry");
            $.mobile.changePage("#loginPage");
			alert("Login Expired");
        }
    }

	



	/**
	----------------------Event handler to process login request----------------------
	**/
	
	$('#loginButton').click(function () {
		// Remove stored token (if any)
		localStorage.removeItem("token");
		localStorage.removeItem("userid");
	
		// Create login data object
		var loginData = {
			email: $("#email").val(),
			password: $("#password").val()
		};
		// Send login request to server
		showLoading();
		$.ajax({
			type: "POST",
			url: "https://assignment-j5w6.onrender.com/api/users/login",
			data: JSON.stringify(loginData), // Convert loginData object to JSON
			contentType: 'application/json', // Set content type to JSON
			success: function(response) {
				hideLoading();
				// Login successful
				localStorage.setItem("token", response.token);
				localStorage.setItem("userid", response.userId);
				localStorage.setItem("email", response.email);
				localStorage.setItem("expiry", response.expiresIn);
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
				var formData = $("#signupform").serializeArray();
				
				var userData = {};
				formData.forEach(function(field) {
					userData[field.name] = field.value;
				});
				showSigning();
				$.ajax({
					type: "POST",
					url: "https://assignment-j5w6.onrender.com/api/users/signup",
					contentType: "application/json",
					data: JSON.stringify(userData), // Pass userData directly
					success: function(response) {
						hideSigning();
						// Registration successful
						localStorage.setItem("token", response.token);
						localStorage.setItem("userid", response.userId);
						localStorage.setItem("email", response.email);
						localStorage.setItem("expiry", response.expiresIn);
						alert("Registration successful!");
						$("#signupform")[0].reset();
						$.mobile.changePage("#homePage");
					},
					error: function(xhr, status, error) {
						hideSigning();
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

	function showSigning() {
		$("#signingup").show();
	}
	
	// Function to hide loading indicator
	function hideSigning() {	
		$("#signingup").hide();
	}
	

	function showUploading() {
		$("#uploadingIndicator").show();
	}
	
	// Function to hide loading indicator
	function hideUploading() {	
		$("#uploadingIndicator").hide();
	}


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
			}
		},
		/* Validation Message */

		messages: {
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
			localStorage.removeItem("userid");
			localStorage.removeItem("email");
			localStorage.removeItem("expiry");
			$.mobile.changePage("#loginPage");
		});
	});



	$(document).on("pagebeforeshow", "#selectPage", function() {
		// Fetch books data from the provided endpoint
		$.get('https://assignment-j5w6.onrender.com/api/books/', function(data) {
			// Clear existing list items
			$('#itemList').empty();
	
			// Iterate through each book and create list items to display them
			$.each(data, function(index, book) {
				// Create list item
				var listItem = $('<li>');
	
				// Create anchor tag
				var anchor = $('<a>').attr('href', '#sendRequestPage');
	
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


	$(document).on("pagebeforeshow", "#sendRequestPage", function() {
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
            url: "https://assignment-j5w6.onrender.com/api/mail",
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
	

	
	$(document).on("pagebeforeshow", "#BookUploadPage", function() {

	
	$('#uploadbutton').click(function () {
		
	
	    var formData = new FormData();

		// Append form fields to FormData object
		formData.append('title', $('#title').val());
		formData.append('author', $('#author').val());
		formData.append('condition', $('#condition').val());
		formData.append('userId', $('#userid').val());

		// Append image file to FormData object
		var imageFile = $('#file')[0].files[0]; // Assuming file input has id "file"
		formData.append('image', imageFile);

		// Log the FormData object (optional)
		console.log(formData);

		// Send AJAX request to the API endpoint
		showUploading();
		$.ajax({
			url: 'https://assignment-j5w6.onrender.com/api/books/',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success: function(response) {
				hideUploading();
				// Handle success response
				alert('Data uploaded successfully:', response);
				
				// Optionally, perform any actions after successful upload
			},
			error: function(xhr, status, error) {
				hideLoading();
				// Handle error response
				if (xhr.responseJSON && xhr.responseJSON.message) {
					// Display the error message returned by the server
					alert('Error uploading data: ' + xhr.responseJSON.message);
				} else {
					// If no specific error message is available, display a generic error message
					alert('Error uploading data. Please try again later.');
				}
				alert('Error uploading data:', error);
				// Optionally, perform any actions after error
			}
		});
	});
})
	

	$(document).on("pagebeforeshow", "#UserPage", function() {
		// Clear existing content inside #userdetail
		$('#userdetail').html("");
		const userId = localStorage.getItem('userid');
		// Make AJAX request to fetch user data
		showLoading();
		$.ajax({
			url: `https://assignment-j5w6.onrender.com/api/users/${userId}`,
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
		const userId = localStorage.getItem("userid");
		$.ajax({
			url: `https://assignment-j5w6.onrender.com/api/books/user/${userId}`,
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
                    url: `https://assignment-j5w6.onrender.com/api/books/${bookId}`,
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


