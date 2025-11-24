
#DevCircle API's

authRouter
- Post/Signup
- Post/login
- Post/logout

ProfileRouter
- Get/Profile/view
- Patch/Profile/edit
- Patch/Profile/Password

connectionRequestRouter     

- Post/request/send/interested/:userId
- Post/request/send/ignored/:userId
- Post/request/review/accepted/:requestId
- Post/request/review/rejected/:requestId

userRouter  

- Get/user/connections
- Get/user/requests
- Get/user/feed