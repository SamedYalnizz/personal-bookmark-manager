// Bookmarks
const bookmarkModal = document.getElementById("bookmark-modal");
const bookmarkColumns = document.querySelector(".bookmark-columns");
const addNewBookmarkBtn = document.getElementById("new-bookmark-btn");
const bookmarkForm = document.getElementById('bookmark-form');
const selectFolderDropdown = document.getElementById('folder-selection');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkExistsErrorMessage = document.getElementById('bookmark-exists-error');
const noBookmarkNameErrorMessage = document.getElementById('no-bookmark-name-error');


// Folder
const folderModal = document.getElementById("folder-modal");
const addNewFolderBtn = document.getElementById("new-folder-btn");
const bookmarkModalCloseIcon = document.getElementById('close-bookmark-modal');
const folderModalCloseIcon = document.getElementById('close-folder-modal');
const folderForm = document.getElementById('folder-form');
const folderNameEl = document.getElementById('folder-name');
const folderExistsErrorMessage = document.getElementById('folder-exists-error');
const noFolderNameErrorMessage = document.getElementById('no-folder-name-error');

const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIcon = document.getElementById('toggle-icon');
const nav = document.getElementById('nav');




// https://github.com/SortableJS/Sortable
Sortable.create(listWithHandle, {
    handle: '.fa-arrows-alt',
    animation: 150,
    onEnd: function (evt) {
        const tempItem = folders[evt.oldIndex];
        folders.splice(evt.oldIndex, 1);
        folders.splice(evt.newIndex, 0, tempItem);
        updateSavedFolders();
    }
});


function addSortableFunctionality(folderIndex){
    let sortableBookmarkList = document.getElementById(`bookmark-list-${folderIndex}`);
    sortableBookmarkList = new Sortable(sortableBookmarkList, {
        handle: '.fa-arrows-alt',
        animation: 150,
        group: 'shared',
        onEnd: function(evt){
            const oldBookmarkIndex = evt.oldIndex;
            const oldFolderIndex = evt.from.id.slice(14);
            const newBookmarkIndex = evt.newIndex; // new bookmarkIndex; 
            const newFolderIndex = evt.to.id.slice(14); // new folderIndex
            // delete old bookmark from old folder
            // add new bookmark to new folder
            const tempBookmark = folders[oldFolderIndex].bookmarks[oldBookmarkIndex];
            folders[oldFolderIndex].bookmarks.splice(oldBookmarkIndex, 1);
            folders[newFolderIndex].bookmarks.splice(newBookmarkIndex, 0, tempBookmark);
            updateSavedFolders();
        }
   })
}



let folders = [];

function closeModals(event){
    // Bug
    if(!bookmarkModal.classList.contains('hidden')){
        if(event.target.closest){
            if(event.target.closest("div > div").parentElement != bookmarkModal &&event.target != bookmarkModal && event.target != addNewBookmarkBtn){
            closeBookmarkModal();
            }
        } 
    } 
    else if(!folderModal.classList.contains('hidden')){
        if(event.target.closest("div > div").parentElement != folderModal && event.target != folderModal && event.target != addNewFolderBtn){
            closeNewFolderModal();
        }
    }
}

function showBookmarkExistsError(folderIndex, bookmarkNameExists){
    if(bookmarkNameExists){
        bookmarkExistsErrorMessage.textContent = "Website Name already exists in folder: " + folders[folderIndex].name;     
    } else {
        bookmarkExistsErrorMessage.textContent = "Website URL already exists in folder: " + folders[folderIndex].name;
    }
    bookmarkExistsErrorMessage.classList.remove('hidden');
    noBookmarkNameErrorMessage.classList.add('hidden');
}

function showNoBookmarkNameError(){
    noBookmarkNameErrorMessage.textContent = "Please fill out all fields.";
    bookmarkExistsErrorMessage.classList.add('hidden');
    noBookmarkNameErrorMessage.classList.remove('hidden');
}

function checkBookmarkError(){
    const bookmarkNameValue = websiteNameEl.value;
    const bookmarkUrlValue = websiteUrlEl.value;
    let bookmarkNameExists = false;
    let bookmarkUrlExists = false;
    let folderIndex;
    folders.forEach((folder, index)=>{
        folder.bookmarks.forEach((bookmark) =>{
            if(bookmark.name == bookmarkNameValue){
                bookmarkNameExists = true;
                folderIndex = index;
            } else if(bookmark.url == bookmarkUrlValue){
                bookmarkUrlExists = true;
                folderIndex = index;
            };
        })
    })
    if(bookmarkNameExists && bookmarkNameValue != ""){
        showBookmarkExistsError(folderIndex, true);
    } else if(bookmarkUrlExists && bookmarkUrlValue != ""){
        showBookmarkExistsError(folderIndex, false)
    } else if(bookmarkUrlValue == "" || bookmarkNameValue==""){
        showNoBookmarkNameError();
    }
}
// function checkFolderErrors(){
//     const folderNameValue = folderNameEl.value;
//     let folderExists = false;
//     folders.forEach((folder) =>{
//         if(folder.name == folderNameValue){
//             folderExists = true;
//         }
//     });
//     if(folderExists && folderNameValue != ""){
//         showFolderExistsError();
//     }
//     else if(!folders.includes(folderNameValue) && folderNameValue == ""){
//         showNoFolderNameError();
//     } else {
//         folderExistsErrorMessage.classList.add('hidden');
//     }
// }

function showNewBookmarkModal() {
    bookmarkModal.classList.remove('hidden');
    closeNewFolderModal();
}

function closeBookmarkModal(){
    bookmarkModal.classList.add('hidden');
}

function updateFolderSelectionDropDown(){
    // Iterate through all folders 
        // create option elements
    selectFolderDropdown.textContent ="";
    folders.forEach((folder, index) => {
        const optionSelection = document.createElement('option');
        optionSelection.value = index;
        optionSelection.textContent = folder.name;
        selectFolderDropdown.appendChild(optionSelection);
    })
}

function createNewBookmark(event){
    event.preventDefault();
    // Get Input Fields
    const websiteName = websiteNameEl.value;
    const websiteUrl = websiteUrlEl.value;
    const folderIndex = selectFolderDropdown.options[selectFolderDropdown.selectedIndex].value;
    let bookmarkExists = false;
    let bookmarkExistsInFolderIndex;
    folders.forEach((folder,index) =>{
        folder.bookmarks.forEach((bookmark) =>{
            if(bookmark.name == websiteName || bookmark.url == websiteUrl){
                bookmarkExists = true;
                bookmarkExistsInFolderIndex = index;
            }
        })
    })
    // Check error messages in a smoother way
    if(!bookmarkExists && (websiteName != "" && websiteUrl != "")){
        let bookmark = {
            name: websiteName,
            url: websiteUrl
        }
        folders[folderIndex].bookmarks.push(bookmark);
        bookmarkForm.reset();
        updateSavedFolders();
        createFoldersDOM();
    } else {
        checkBookmarkError();
    } 
}



//Continue working here
function editBookmark(event){
    let indicesArray = event.target.id.split('-');
    // get Element By Id
    const bookmarkUrl = document.getElementById(`Url-${indicesArray[0]}-${indicesArray[1]}`);
    bookmarkUrl.setAttribute('contentEditable', 'true');
    bookmarkUrl.focus();
        // onfocusout, updateBookmarkName
}

function deleteBookmark(event){
    let indicesArray = event.target.id.split('-');
    folders[indicesArray[0]].bookmarks.splice(indicesArray[1], 1);
    updateSavedFolders();
    createFoldersDOM();
}

function updateBookmarkLink(folderIndex, bookmarkIndex){
    const bookmarkUrl = document.getElementById(`Url-${folderIndex}-${bookmarkIndex}`);
    const newLink = bookmarkUrl.textContent;
    bookmarkUrl.href = newLink;
    if(newLink == ""){
        folders[folderIndex].bookmarks.splice(bookmarkIndex, 1);
    } else {
        folders[folderIndex].bookmarks[bookmarkIndex].url = newLink;
    }
    updateSavedFolders();
    createFoldersDOM();
    bookmarkUrl.setAttribute('contentEditable', 'false');
}

function updateBookmarkName(folderIndex, bookmarkIndex){
    const bookmarkName = document.getElementById(`bookmark-name-${folderIndex}-${bookmarkIndex}`);
    const newBookmarkName = bookmarkName.textContent;
    if(newBookmarkName == ""){
        folders[folderIndex].bookmarks.splice(bookmarkIndex, 1);
    } else {
        folders[folderIndex].bookmarks[bookmarkIndex].name = newBookmarkName;
    }
    updateSavedFolders();
    createFoldersDOM();
}

// Folder Functions
function showNewFolderModal(){
    folderModal.classList.remove('hidden');
    closeBookmarkModal();
}

function closeNewFolderModal(){
    folderModal.classList.add('hidden');
    folderForm.reset();
}
function showFolderExistsError(){
    folderExistsErrorMessage.classList.remove('hidden');
    noFolderNameErrorMessage.classList.add('hidden');

}
function showNoFolderNameError(){
    noFolderNameErrorMessage.classList.remove('hidden');
    folderExistsErrorMessage.classList.add('hidden');

}

function checkFolderErrors(){
    const folderNameValue = folderNameEl.value;
    let folderExists = false;
    folders.forEach((folder) =>{
        if(folder.name == folderNameValue){
            folderExists = true;
        }
    });
    if(folderExists && folderNameValue != ""){
        showFolderExistsError();
    }
    else if(!folders.includes(folderNameValue) && folderNameValue == ""){
        showNoFolderNameError();
    } else {
        folderExistsErrorMessage.classList.add('hidden');
    }
}


function saveFolder(event){
    event.preventDefault();
    const folderNameValue = folderNameEl.value;
    // Check if folders[0-x].name 
    let folderExists = false;
    folders.forEach((folder) =>{
        if(folder.name == folderNameValue){
            folderExists = true;
        }
    })
    if(!folderExists && folderNameValue != ""){
        let folder = {
            name: folderNameValue,
            bookmarks: []
        }
        folders.push(folder);
        console.log(folders);
        folderForm.reset();
        localStorage.setItem('Folders', JSON.stringify(folders));
        createFoldersDOM();
        updateFolderSelectionDropDown();
    } else {
        checkFolderErrors();
    }
}

function createFoldersDOM(){
    bookmarkColumns.textContent="";
    folders.forEach((folder, index) =>{
        const column = document.createElement('div');
        column.classList.add('bookmark-column');
        column.classList.add('list-group-item');
        const moveIcon = document.createElement('i');
        moveIcon.classList.add('fa');
        moveIcon.classList.add('fa-arrows-alt');
        moveIcon.setAttribute('aria-hidden', 'true');  
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas');
        deleteIcon.classList.add('fa-times');
        deleteIcon.classList.add('close-icon');
        deleteIcon.classList.add('delete-folder-icon');
        deleteIcon.setAttribute('id', `${index}`)
        deleteIcon.addEventListener('click', deleteFolder);
        const header = document.createElement('div');
        header.classList.add('header');
        const title = document.createElement('h1');
        title.setAttribute('id', `title-${index}`);
        title.textContent = folder.name;
        title.contentEditable = true;
        title.setAttribute('onfocusout', `updateFolderName(${index})`);
        //create Bookmarks in DOM
        const bookmarkList = document.createElement('ul');
        bookmarkList.classList.add('bookmark-list');
        bookmarkList.id = `bookmark-list-${index}`;
        bookmarkList.classList.add('list-group');
        bookmarkList.classList.add('col');
        
        folder.bookmarks.forEach((bookmark, bookmarkIndex) =>{
            const listItem = document.createElement('li');
            listItem.classList.add('bookmark-item');
            const moveBookmarkIcon = document.createElement('i');
            moveBookmarkIcon.classList.add('fa');
            moveBookmarkIcon.classList.add('fa-arrows-alt');
            moveBookmarkIcon.classList.add('bookmark-move-icon');
            const bookmarkNameDiv = document.createElement('div');
            bookmarkNameDiv.classList.add('bookmark-name');
            bookmarkNameDiv.textContent = bookmark.name;
            bookmarkNameDiv.id = `bookmark-name-${index}-${bookmarkIndex}`;
            bookmarkNameDiv.setAttribute('contentEditable', 'true');
            bookmarkNameDiv.setAttribute('onfocusout', `updateBookmarkName(${index}, ${bookmarkIndex})`);
            const bookmarkUrlDiv = document.createElement('div');
            bookmarkUrlDiv.classList.add('bookmark-link');
            const bookmarkUrl = document.createElement('a');
            bookmarkUrl.id = "Url-" + index + "-" + bookmarkIndex;
            bookmarkUrl.setAttribute('target', '_blank')
            bookmarkUrl.href = bookmark.url;
            bookmarkUrl.textContent = bookmark.url;
            bookmarkUrl.setAttribute('onfocusout', `updateBookmarkLink(${index}, ${bookmarkIndex})`);
            bookmarkUrlDiv.appendChild(bookmarkUrl);
            const editIcon = document.createElement('i');
            editIcon.classList.add('fas');
            editIcon.classList.add('fa-edit');
            editIcon.classList.add('edit-icon');
            editIcon.id = index + "-" + bookmarkIndex;
            editIcon.addEventListener('click', editBookmark);
            const deleteBookmarkIcon = document.createElement('i');
            deleteBookmarkIcon.classList.add('fas');
            deleteBookmarkIcon.classList.add('fa-trash');
            deleteBookmarkIcon.classList.add('close-icon');
            deleteBookmarkIcon.classList.add('delete-bookmark-icon');
            deleteBookmarkIcon.id = index + "-" + bookmarkIndex;
            deleteBookmarkIcon.addEventListener('click', deleteBookmark);
            bookmarkUrlDiv.appendChild(editIcon);
            listItem.append(moveBookmarkIcon, deleteBookmarkIcon, bookmarkNameDiv, bookmarkUrlDiv) ;
            bookmarkList.appendChild(listItem);
        })
        
        header.append(title);
        column.append(moveIcon, deleteIcon, header, bookmarkList);
        bookmarkColumns.appendChild(column);
        addSortableFunctionality(index);
    })
}
function deleteFolder(event){
    // Add Confirmation Alert
    folders.splice(event.srcElement.id, 1);
    updateSavedFolders();
    createFoldersDOM();
    updateFolderSelectionDropDown();
}

// Update Folders in DOM - Reset HTML, Filter Array, Update localStorage

function updateSavedFolders(){
    localStorage.setItem('Folders', JSON.stringify(folders));
}

function updateFolderName(folderId){
    const folderName = document.getElementById("title-" + folderId);
    let folderExists = false;
    if(folderName.textContent == ""){
        folders.splice(folderId, 1);
    } else if(folderName) {
        folders.forEach((folder) =>{
            if(folder.name == folderName.textContent){
                folderExists = true;
            };
        });

        if(!folderExists){
            folders[folderId].name = folderName.textContent;
        };
    }
    updateFolderSelectionDropDown();
    updateSavedFolders();
    createFoldersDOM();
}

function fetchFolders(){
    if(localStorage.getItem('Folders')){
        folders = JSON.parse(localStorage.getItem('Folders'));
    } else {
        let bookmark1 = {
            name: "Google",
            url: "www.google.de"
        }
        let bookmark2 = {
            name: "github",
            url: "www.github.com"
        }
        let bookmark3 = {
            name: "bloomberg",
            url: "www.bloomberg.com"
        }
        let bookmark4 = {
            name: "FT",
            url: "www.ft.com"
        }
        let folder1 = {
            name: 'To Read',
            bookmarks: [bookmark1, bookmark2]
        }
        let folder2 = {
            name: 'Coding',
            bookmarks: [bookmark3]
        }
        let folder3 = {
            name: 'News',
            bookmarks: [bookmark4]
        }
        let folder4 = {
            name: 'Personal',
            bookmarks: []
        }
        folders = [ folder1 , folder2 , folder3 , folder4];
        localStorage.setItem('Folders', JSON.stringify(folders));
    }
    createFoldersDOM();
    updateFolderSelectionDropDown();
}

function darkMode() {
    nav.style.backgroundColor = 'rgb(0 0 0 / 50%)';
    //textBox.style.backgroundColor = 'rgb(255 255 255 / 50%)';
    toggleIcon.children[0].textContent = 'Dark Mode';
    toggleIcon.children[1].classList.replace('fa-sun', 'fa-moon');
  }
  
  // Light Mode Styles
  function lightMode() {
    nav.style.backgroundColor = 'rgb(255 255 255 / 50%)';
    //textBox.style.backgroundColor = 'rgb(0 0 0 / 50%)';
    toggleIcon.children[0].textContent = 'Light Mode';
    toggleIcon.children[1].classList.replace('fa-moon', 'fa-sun');
  }

  // Switch Theme Dynamically
  function switchTheme(event) {
    if (event.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      darkMode();
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      lightMode();
    }
  }

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
document.documentElement.setAttribute('data-theme', currentTheme);

if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
    darkMode();
}
}


//Event Listeners
window.addEventListener('click', closeModals);
addNewBookmarkBtn.addEventListener('click', showNewBookmarkModal);
bookmarkModalCloseIcon.addEventListener('click', closeBookmarkModal);
bookmarkForm.addEventListener('submit', createNewBookmark);
websiteNameEl.addEventListener('change', checkBookmarkError);
websiteUrlEl.addEventListener('change', checkBookmarkError);


addNewFolderBtn.addEventListener('click', showNewFolderModal);
folderModalCloseIcon.addEventListener('click', closeNewFolderModal);
folderForm.addEventListener('submit', saveFolder);
folderNameEl.addEventListener('change', checkFolderErrors);

toggleSwitch.addEventListener('change', switchTheme);






// On Load
fetchFolders();