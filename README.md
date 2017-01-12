Server Readme

These are the API calls:

Get all the groups
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/groups/

Get a specific group
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/groups/:groupName

Create a group (Post)
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/groups/
{
	groupName : groupName,
	range : number,
	host : username
}

Add a user to the group (Put)
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/groups/:groupName/ 
{
	members: memberName
}
OR
{
    host : memberName
}

Delete a group: (Delete)
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/groups/:groupName

Delete a user from a group:  (Delete)
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/groups/TestGroup?members=memberUserName

Get all the users
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/users/

Get a specific user
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/users/:username

Login (Post)
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/users/login
{
	username : username,
	password : password
}

Logout (Get)
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/users/logout

Sign up (Post)
http://ec2-54-158-251-62.compute-1.amazonaws.com:8080/users/signup
{
	username : username,
	phoneNumber : phoneNumber,
	firstName : firstName,
	lastName : lastName,
	password : password
}


