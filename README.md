# Library Management System

An application designed for the school library. This system will enable efficient of a library's book collection, providing an intuitive interface for users and comprehensive administrative functionality for library staff. User's functionalities will be searching,borrowing,reservingi and returning books. Administrator's functionalities will be managing book records, user accounts and generating reports.

## Features
* Users can search for books either by keyword or specific book type
* Users can borrow available books
* Users can reserve books that are currently unavailable
* Users can view the status of their borrowed or reserved books
* Users can cancel their book reservations
* Librarians can add new books to the library's collection
* Librarian can update information on existing books
* Librarian can delete books from the library's collection
* Administrators can manage user accounts

## Getting Started 

### Initialization for frontend
1) Download the files in zip format (if you want to clone the repository, skip to 3)
2) Extract the files on your specified folder
3) Open the folder and move the folder `Library Backend` to another folder
4) Open the files in Visual Studio Code
5) Create a new terminal and type in `npm install date-fns@2.29.3 @mui/x-date-pickers@latest` and wait for it to finish
6) Type in `npm start` to start the application

### Initialization for backend
1) Open Eclipse IDE and MYSQL Workbench
2) On Eclipse IDE, Click on `File` on the top left and then `Import...`
3) Select Existing Maven Projects and click next
4) Click `Browse...` then navigate to where you put your `Library Backend` folder
5) Select the folder and checklist the `/pom.xml` file and click `Finish`
6) Open the folder and navigate to `src/main/resources` then `application.properties` inside the folder
7) Change the first three lines to the following : 

* spring.datasource.url=jdbc:mysql://localhost:3306/library_db
* spring.datasource.username=root
* spring.datasource.password=root

9) For MYSQL Workbench, create a new connection named `librarybackend`
10) Open the connection and see if the connection of the server is running by clicking on the top named `Server` then `Server Status` and check if the server is running
11) Open the connection and on the `SCHEMAS` tab, add a new schema named `library_db`
12) On the Eclipse IDE side, run the database by navigating to `src/main/java` -> `libraryManagement.librarybackend` -> `LibraryBackendApplication.java` and run the file

### After doing all these steps, you should be able to run the application.
