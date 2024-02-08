//DATABASE SECTION
/* 
    -initializeApp is a firebase Function that we import from the 
    firebase App url location
    -getDatabase, ref & push there are firebase database funtions used 
    for data.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
/* 
    This is our Project That all This data will be stored in.
*/
const appSettings = {
    databaseURL: "https://adddetails-daa50-default-rtdb.europe-west1.firebasedatabase.app/"
}
/* - We made app,database &shoppingListInDB variables 
    to store firebase functions and its arguments.
    -We want to make communication between Firebase App & our Project
    in this case it's appSettings , WE store it inside an app variable .
    -We want to feed the getDatabase() the app variable and keep that 
    data inside a new database variable.
    -Then we need to create a reference to keep track of our database
    -We also need a push() to push our data inside our Project
*/
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")//shopping list id the name of the database


//BUTTON & iNPUT SECTION

/* -when you enter a product inside an input ,it is stored in 
   "inputField
   " variable .
*/
const inputField = document.getElementById("input-field")
const shoppingList = document.getElementById("shopping-list")
const addButton = document.getElementById("add-button")
/* - When clicked it stores the InputField value 
    inside a new variable called InputValue
    -push shoppingListInDB and inputValue on to the database Project
*/
addButton.addEventListener("click", function() {
    let inputValue = inputField.value
    push(shoppingListInDB, inputValue)
   
    clearInputValue()
    //showItemToShoppingList(inputValue)//when calling the func we feed it the inputValue
})

function clearInputValue() {
    inputField.value = "" //clear the previous product entered
}
function showItemToShoppingList(item) { //then we to give it a parameter 
    // shoppingList.innerHTML += `<li>${itemValue}</li>`

    // This is the other way of Doing since the previous 1 is limiting us since the list is not hardcoded in the html.
    let itemID = item[0] 
    let itemValue = item[1]

    let newLi = document.createElement("li") //we can create any element here.
    newLi.textContent = itemValue //itemValue all the named items

    // This code we use it to remove unwanted item from the database and list 
    newLi.addEventListener("click", function() {
        //taking ref from our project so that when item clicked it must be deleted
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
    //This function removes items when clicked
    remove(exactLocationOfItemInDB)
    })

    shoppingList.append(newLi) //
    

}

//FETCHING DATA FROM FIREBASE TO DISPLAY IN OUR APP

/*  -onValue() we use it to get data from our Project
    -We need to give the onValue the ref of where we want to get the 
    data from . Most case it the variable that ends with DB.
    -Then We need to give our function a (snapshot) parameter .EG : onValue(shoppingListInDB, function(snapshot))
    -Make sure you convert object.value to snapshot.val() this will make our object to be a 
    an array. We want an array not object
    -then we can create a for loop 
    -use showItemToShoppingList(itemValue) to show your data on html on the loop.
*/

onValue(shoppingListInDB, function(snapshot){
    //i had to put the for loop inside an if statement because when we had to delete the last product on the list it was givin us null.

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val()) //we can use keys,values & entries
    
        clearShoppingList()
        for (let i = 0; i < itemsArray.length; i++) {
    
            let currentItem = itemsArray[i] //stored the arrays of items in currentItem var.
            let currentItemID = currentItem[0] //we access the ID of the items
            let currentItemValue = currentItem[1] //we access their values
            
            showItemToShoppingList(currentItem) /*Bug: the items where doubling cause we had 
                                                    had the same code running at the addbutton() */
        } 

        
    } else {
        shoppingList.innerHTML = "No Items"
    }

})

function clearShoppingList() {
     shoppingList.innerHTML = ""//so that it doesnt repeat the list again(dont duplicate)
}