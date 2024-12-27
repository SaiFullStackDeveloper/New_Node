1. npm install
2. create some users by using `http://localhost:3000/api/register`
                Inputs : {
                            "username" : "agent",
                            "password" : "12345",
                            "role" : "Agent"
                        }
3. Now login with `http://localhost:3000/api/login` and get the tokcn
                     Inputs : {
                            "username" : "agent",
                            "password" : "12345",
                        }

4. For each API in `headers`  
        token : role Based authentication token
        authorization : 3rd party api generated tokcn
   Mandatory to add.
6. API's List
  a. http://localhost:3000/api/quotation
  b. http://localhost:3000/api/proposal-application
  c. http://localhost:3000/api/policy-issuance
  d. http://localhost:3000/api/vpc-vehicle-master
  For all the api's body is same as 3rd party api's body

7.Role based Authentication is made, And now `Admin` and `User` Had the full access to the all api's.
8. Testing API : http://localhost:3000/api/admin : only tokcn needed to test the role-based authentication.
