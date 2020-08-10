const addClose = document.querySelector('#add-out');
const addDiv = document.querySelector('#add-div');
const openAddForm = document.querySelector('#open-add-form'); 

addClose.addEventListener('click', () => {
  addDiv.style.display = 'none';
})

openAddForm.addEventListener('click', () => {
  addDiv.style.display = 'flex';
})

const updateClose = document.querySelector('#update-out');
const updateDiv = document.querySelector('#update-div');

updateClose.addEventListener('click', () => {
  updateDiv.style.display = 'none';
})

function openUpdateForm () {
  updateDiv.style.display = 'flex';
}



document.addEventListener('keydown', (event) => {
  if(event.keyCode === 27){
    addDiv.style.display = 'none';
    updateDiv.style.display = 'none';
  }
})