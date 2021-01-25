# User System and Security Setup 

This project starter shipped with minium API configuration with proper user management and security setup. You may modify the code freely adding functionality or setup you like.

## Login, Refresh and Logout Functionality 
Login functionality handled by the `POST /auth/login` under `/api/auth/auth-controller.ts`. The login functionality return JWT Tokens follow refresh token best practice: 
* Login token used to access private resources based on user role defined in the JWT claims. This token has short live time.
* Refresh token used to get new tokens after the login token expired. This token is never expired. This token cannot be used to access private resources because it long lived token. 
Login functionality also writes cookie to the client API with long lived token, the cookie setup with option `http-only` and `same-site: lax`, to prevent XSS and CSRF attack. 

Refresh token `POST /auth/refresh` uses the same logic with login function on signing the tokens, but its only allow request with refresh token attached. 

Logout functionality `GET /auth/logout` used to clear the cookie sent to the API client, you may omit this function when you are using bearer authentication.

## Authorization Function

Project starter provide a standard setup on securing the API. By default it defined two user roles which is
* `User` is a common user that has limited access to most API
* `Admin` is a user with more access to the API
Both defined using Plumier special property `role` on JWT claim defined on `UserLogin` data type. 

There are some authorization policy also defined to support the current auth system defined on `/api/auth/auth-policy.ts` and `/api/user/user-policy.ts`.
* `Private` is the default (global) policy applied to all API endpoints. This policy will allow all request contains bearer token (login token retrieved from login function). It also reject request contains bearer with refresh token, to prevent refresh token being used as login token. 
* `RefreshToken` is special auth policy to override the global `Private` policy used on the `AuthController.refresh`, to make it possible to access `POST /auth/refresh` with refresh token.
* `ResourceOwner` is an entity policy used to describe if the current login user (described on the JWT claim) is the owner of the resource accessed.

## User Management Function 

Project starter provided minimum user management handled by generic controller, with setup below. 
* User registration `POST /users` accessible by public, means anyone can create account.
* Modify, Delete, Get By ID, only `PUT PATCH DELETE GET /users/{id}` accessible by the user itself (`ResourceOwner`)
* Get all users `GET /users?limit&offset&filter` only accessible by `Admin` 
* Password hashed using bcrypt, its a writeonly field.
* Email field only visible by the user itself (`ResourceOwner`)
* Role field only visible by the user itself (`ResourceOwner`) and `Admin`
