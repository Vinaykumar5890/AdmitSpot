# Authentication

Given an `app.js` file and a database file `userData.db` consisting of a  table `user` , `contact`.

Write APIs to perform operations on the table `user` containing the following columns,

**User Table**

| Column   | Type    |
| -------- | ------- |
| username | TEXT    |
| email    | TEXT    |
| password | TEXT    |

### API 1

#### Path: `/register`

#### Method: `POST`

**Request**

```
{
  "username": "adam_richard",
  "email": "Adam@gmail.com",
  "password": "richard_567",
}
```

- **Scenario 1**

  - **Description**:

    If the username already exists

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      User already exists
      ```

- **Scenario 2**

  - **Description**:

    If the registrant provides a password with less than 5 characters

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Password is too short
      ```

- **Scenario 3**

  - **Description**:

    Successful registration of the registrant

  - **Response**
      - **Status code**
        ```
        200
        ```
      - **Status text**
       ```
       User created successfully
       ```

### API 2

#### Path: `/login`

#### Method: `POST`

**Request**
```
{
  "email": "adam@gmail.com",
  "password": "richard_567"
}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      Login success!
      ```

### API 3

#### Path: `/change-password`

#### Method: `PUT`

**Request**

```
{
  "username": "adam_richard",
  "oldPassword": "richard_567",
  "newPassword": "richard@123"
}
```

- **Scenario 1**

  - **Description**:

    If the user provides incorrect current password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid current password
      ```

- **Scenario 2**

  - **Description**:

    If the user provides new password with less than 5 characters

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Password is too short
      ```

- **Scenario 3**

  - **Description**:

    Successful password update

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      Password updated
      ```


### API 4

#### Path: `/users/:username`

#### Method: `GET`

**Request params**

```
{
  "username": "ram"
}
```


  - **Response**
  
      {
      "username": "ram",
      "email": "ram@gmail.com",
      "password": "$2b$10$hXwaHYj8gcyE0TwV4sGdDu.gdK34AH3SvCzi6tzgQDvyqMG5RAGLu"
      }


  - **Description**:

    Successfully get users

### API 5

#### Path: `/users`

#### Method: `GET`

  - **Response**
  
      {
      "username": "ram",
      "email": "ram@gmail.com",
      "password": "$2b$10$hXwaHYj8gcyE0TwV4sGdDu.gdK34AH3SvCzi6tzgQDvyqMG5RAGLu"
      }


  - **Description**:

    Successfully get users


<br/>


Write APIs to perform operations on the table `contact` containing the following columns,

**Contact  Table**

| Column   | Type    |
| -------- | ------- |
| name     | TEXT    |
| email    | TEXT    |
| phone    | TEXT    |
| address  | TEXT    |
| timezone | TEXT    |
|created_at| TEXT    |


### API 6

#### Path: `/contact`

#### Method: `POST`

**Request**

```
{
   "name": "Devaragari vinay Kumar",
   "email": "devaragarivinayyadav7@gmail.com",
   "phone": "9030664422",
   "address": "6-63 thimmaguda , Haythnagar",
   "timezone": "2024-10-24 05:23:55",
   "created_at": "2024-10-23 16:14:23"
}
```

- **Scenario 1**

  - **Description**:

    If the username already exists

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      User already exists
      ```


- **Scenario 2**

  - **Description**:

   contact post 

  - **Response**
      - **Status code**
        ```
        200
        ```
      - **Status text**
       ```
       contact  created successfully
       ```

### API 7

#### Path: `/contact`

#### Method: `GET`


- **Scenario 1**

  - **Description**:

     User get Successful

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
     {
       "name": "Devaragari vinay Kumar",
       "email": "devaragarivinayyadav7@gmail.com",
        "phone": "9030664422",
        "address": "6-63 thimmaguda , Haythnagar",
         "timezone": "2024-10-24 05:23:55",
         "created_at": "2024-10-23 16:14:23"
      }
```


### API 8

#### Path: `/contact/:id`

#### Method: `DELETE`


- **Scenario 1**

  - **Description**:

     Contact DELETE successfully

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
     Contact delete successfully
```





Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
