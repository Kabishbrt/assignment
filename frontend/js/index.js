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

		localStorage.removeItem("inputData");

		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));
			var allUsers = JSON.parse(localStorage.getItem("allUsers"));	

			allUsers.forEach(function(userData){		
			
				if (inputData.email == userData.email && inputData.password == userData.password) {
					authenticated = true;
					alert("Login success");
					localStorage.setItem("userInfo", JSON.stringify(userData));
					$.mobile.changePage("#homePage");
				} 
			}); 	
			
			if (authenticated == false){
				alert("Login failed");
			}

			$("#loginForm").trigger('reset');
		}	
	})

	

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
				localStorage.setItem("userInfo", JSON.stringify(userData));

				var allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
				allUsers.push(userData);
				localStorage.setItem("allUsers", JSON.stringify(allUsers));
				
				$("#signupform")[0].reset();
	
				alert("Registration successful!");
				$.mobile.changePage("#homePage");
			}
		});
	});

	
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
		
		$("#itemSelected").text(localStorage.getItem("itemName"));
		$("#priceSelected").text(localStorage.getItem("itemPrice"));
		$("#imageSelected").attr('src', localStorage.getItem("itemImage"));

	});  

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
    
		$('#userdetail').html("");
		
		if (localStorage.userInfo != null) {
			var userInfo = JSON.parse(localStorage.getItem("userInfo"));
			console.log(userInfo);
		
			if (userInfo) {
				$('#userdetail').append('<br><table><tbody>');
				$('#userdetail').append('<tr><td>Email: </td><td><span class=\"fcolor\">' + userInfo.email + '</span></td></tr>');
				$('#userdetail').append('<tr><td>Name: </td><td><span class=\"fcolor\">' + userInfo.firstName + ' ' + userInfo.lastName + '</span></td></tr>');   
				$('#userdetail').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + userInfo.address + ', ' + userInfo.state + ', ' + userInfo.postcode + '</span></td></tr>');
				$('#userdetail').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + userInfo.phoneNumber + '</span></td></tr>');
				$('#userdetail').append('</tbody></table><br>');
			} else {
				$('#userdetail').append('<h3>User information not found</h3>');
			}
		} else {
			$('#userdetail').append('<h3>No user information found</h3>');
		}
	});
	
	


	/**
	--------------------------end--------------------------
	**/	

	

});


