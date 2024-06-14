//function for error handling
// set j web token expire
//input validation
//row level policy
//Implement rate limiting and throttling to prevent abuse and protect against denial-of-service (DoS) attacks.
//think about implement role based auth
//database constraint need to redifine 
//new column in user table - 1- isverify 2-role -user/admin
//testing

//chalanges 
1- how I update description like if there 3000 char , does it update in optimize way and 2nd is des column has 100 char like from a to p , new update user does is p to k how i update in db or should i update whole a to k string to the database. -- solve, just use patch instead of put and check changes notes char in client side
2 - should i put username or i just keep email
3- i think i have to put limit in how many api request user can send to backend at lest in update api
4- should i validate searchvalue like spaces and how many char in searchvalue
5- imp - i have to send validation code over new user email to check the email is right

//need to update after v1 uploaded -- very imp feature
1-user email authentication
2- change password feature
2-google authentication
3-sync of all devices
4-offline mode feature
5-learn about advance nodejs like scalling by youtube channel software devloper diaries

//to advertise my product in X
-- need to think about it more how i will do it
-- think about patterns/way to advertise smartly