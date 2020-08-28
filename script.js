const folderModal = document.getElementById("folder-modal");
const bookmarkModal = document.getElementById("bookmark-modal");
const bookmarkColumns = document.querySelector(".bookmark-columns");
const addNewBookmarkBtn = document.getElementById("new-bookmark-btn");
const addNewFolderBtn = document.getElementById("new-folder-btn");
const bookmarkModalCloseIcon = document.getElementById('close-bookmark-modal');
const folderModalCloseIcon = document.getElementById('close-folder-modal');
const folderForm = document.getElementById('folder-form');
const folderNameEl = document.getElementById('folder-name');
const folderExistsErrorMessage = document.getElementById('folder-exists-error');
const noFolderNameErrorMessage = document.getElementById('no-folder-name-error');

let sortable = Sortable.create(bookmarkColumns);


// https://github.com/SortableJS/Sortable

let folders = [];

function showNewBookmarkModal() {
    bookmarkModal.classList.remove('hidden');
}

function closeBookmarkModal(){
    bookmarkModal.classList.add('hidden');
}

function showNewFolderModal(){
    folderModal.classList.remove('hidden');
}

function closeNewFolderModal(){
    folderModal.classList.add('hidden');
}
function showFolderExistsError(){
    folderExistsErrorMessage.classList.remove('hidden');
}
function showNoFolderNameError(){
    noFolderNameErrorMessage.classList.remove('hidden');
}

function checkFolderErrors(){
    const folderNameValue = folderNameEl.value;
    if(folders.includes(folderNameValue) && folderNameValue != ""){
        showFolderExistsError();
    }
    else if(folderNameValue == ""){
        showNoFolderNameError();
    } else {
        folderExistsErrorMessage.classList.add('hidden');
    }
}


function saveFolder(event){
    event.preventDefault();
    const folderNameValue = folderNameEl.value;
    console.log(folderNameValue);
    if(!folders.includes(folderNameValue)){
        folders.push(folderNameValue);
        folderForm.reset();
        localStorage.setItem('Folders', JSON.stringify(folders));
        createFoldersDOM();
    } else {
        showFolderExistsError();
    }
}

function saveFolderNameEdit(event){
    let title = document.getElementById(`${event.srcElement.id}`);
    console.log(event);
}

function createFoldersDOM(){
    bookmarkColumns.textContent="";
    folders.forEach((folder, index) =>{
        const column = document.createElement('div');
        column.classList.add('bookmark-column');
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

        title.setAttribute('id', `title-${index}`)
        title.textContent = folder;
        title.contentEditable = true;
        const titleId = "title-"+ index;
        console.log(titleId);
        title.setAttribute('onfocusout', `updateFolderName(${index})`);
        console.log(titleId);
        const bookmarkList = document.createElement('ul');
        bookmarkList.classList.add('bookmark-list');
        header.appendChild(title);
        column.append(deleteIcon, header, bookmarkList);
        bookmarkColumns.appendChild(column);
    })
}
function deleteFolder(event){
    // Add Confirmation Alert
    folders.splice(event.srcElement.id, 1);
    createFoldersDOM();
}

// Update Folders in DOM - Reset HTML, Filter Array, Update localStorage

function updateSavedFolders(){
    localStorage.setItem('Folders', JSON.stringify(folders));
}

function updateFolderName(folderId){
    const folderName = document.getElementById("title-" + folderId);
    console.log("title" + folderId);
    console.log(folderName);

    if(!folderName.textContent){
        folders.splice(folderId, 1);
    } else if(folderName) {
        folders[folderId] = folderName.textContent;
    }
    updateSavedFolders();
}


function fetchFolders(){
    if(localStorage.getItem('Folders')){
        folders = JSON.parse(localStorage.getItem('Folders'));
    } else {
        folders = ['To Read', 'Coding', 'News', 'Personal'];
        localStorage.setItem('Folders', JSON.stringify(folders));
    }
    createFoldersDOM();
}


//Event Listeners
addNewBookmarkBtn.addEventListener('click', showNewBookmarkModal);
bookmarkModalCloseIcon.addEventListener('click', closeBookmarkModal);

addNewFolderBtn.addEventListener('click', showNewFolderModal);
folderModalCloseIcon.addEventListener('click', closeNewFolderModal);
folderForm.addEventListener('submit', saveFolder);
folderNameEl.addEventListener('change', checkFolderErrors);



// On Load
fetchFolders();