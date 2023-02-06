// ****** SELECT ITEMS **********
// gonna change these by javaScript by getting the containers and the submit and clear buttons because those buttons change the entire form when clicked
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn")


// edit option
// not defining yet, will define later
let editElement;
// this variable will be false because it won't edit from the getgo
let editFlag = false;
// get a specific item in list
let editId = "";

// ****** EVENT LISTENERS **********
// submit form...will call function here and define function below...listening for the submit button on grocery-form class
form.addEventListener("submit", addItem)
// clear items
clearBtn.addEventListener("click", clearItems);

// load items from setUpItems function that has the list already populated with items when the window is opened if the items were not previously deleted
window.addEventListener("DOMContentLoaded", setUpItems)


// ****** FUNCTIONS **********
// adding event object so the submit button won't submit to a server
function addItem(e) {
    e.preventDefault();
    // accessing value of grocery variable...aka getting the input of whatever is added to list by using the value property
    const value = grocery.value;
    // getting an unique id for each element added to the list...lazy way to do things only doing because this is a sample project...getting date and turning it to millisecs then turning it to a string    
    const id = new Date().getTime().toString();
    // if value is not equal to empty string and editFlag is not true then addItem using article element from HTML...this will create an item list which is a function that is called back
    if (value && !editFlag) {
        createListItem(id, value);
    // displaying the alert 
    displayAlert("item successfully added.", "success");
    // show container...its hidden in css but when item is added want to show to list
    container.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
    }
    // if there is a value and editFlag is true then will be editing item
    else if (value && editFlag) {
        // assigning the edited value back to the original value
        editElement.innerHTML = value;
        displayAlert("value changed.", "success");
        // edit local storage
        editLocalStorage(editId, value);
        setBackToDefault();
    }
    // warning user to enter value if they are not adding or editing using the function below
    else {
       displayAlert("please enter value!", "danger"); 
    }
}
// display alert...textContent will be the text entered and the classList will be whatever action is danger or success then passing it in the else statement above
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    
    // remove alert after 1 sec...textContent will be empty because we are removing the string
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000)
}
// clear items when clearBtn is clicked
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    // if items is greater than 0 then iterate of the items and remove each item
    if (items.length > 0) {
        items.forEach(function(item) {
            groceryList.removeChild(item)
        });
    }
    // if everything is removed then we want to hide container again and display an alert to warn that the list is gone and setting everything back to default 
    container.classList.remove("show-container");
    displayAlert("empty list", "danger")
    setBackToDefault();
    localStorage.removeItem("list");
}
// delete function...adding event to get currentTarget which is the button specifically and the whole item with the parent elememt and getting id from the element dataset of that certain item being deleted
function deleteItem(e) {
    const eventElement = e.currentTarget.parentElement.parentElement;
    const id = eventElement.dataset.id;
    groceryList.removeChild(eventElement);
    // if all items are delete then remove container and set everything back to default
    if (groceryList.children.length === 0) {
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// edit function
function editItem(e) {
    const eventElement = e.currentTarget.parentElement.parentElement;
    // set edit item...by getting the title class of the p element to put it back in the input box to edit it
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = eventElement.dataset.id;
    // changing the submitbtn to edit instead of submit when in edit mode
    submitBtn.textContent = "edit";
}
// set back to default...makes the value inputed go back to the default/empty string after item is added...the other things in this function will come into play when function is called elsewhere
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
// adding the id and value when called and saying if value of "list" is there then return it or return an empty array...if there is a list, then set up with JSON.parse as a list
function addToLocalStorage(id, value) {
    const grocery = { id, value }; 
    let items = getLocalStorage();
    items.push(grocery);
    // setting the items to a list and making them into strings
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    
    // iterate over items array and filtering values that don't match the id
    items = items.filter(function(item){ 
        // if item id doesn't match id that is being passed...the one that actually matches will be removed
        if (item.id !== id) {
            return item;
        }

    });
    // once item is removed it will removed in the local storage
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    // iterating over items and if item id doesn't match then return item but if item does match then set the old value to = new value that was edited
    items = items.map(function(item){
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];  
  
}


// ****** SETUP ITEMS ********
// getting items from local storage when website loads and showing the container of items 
function setUpItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item){
            createListItem(item.id, item.value);
        })
    container.classList.add("show-container");
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");
        // add class by adding item to article element...basically setting up the article element in here instead of in the HTML
        element.classList.add("grocery-item");
        // add id by creating an attribute to go in front of grocery item added
        const attr = document.createAttribute("data-id");
        attr.value = id;
        element.setAttributeNode(attr);
        // adding whatever value is entered in the input box
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
    // accessing the 2 btns within the article which is why it's element and not document befere querySelector...need to access these variables after element is defined
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    // append child
    groceryList.appendChild(element);
}