const electron = require('electron');
const ipc = electron.ipcRenderer;
var idList;

const dom = {
  List: document.querySelector('.display-lists'),
  App: document.querySelector('.app'),
  ToDo: document.querySelector('#todo'),
  Done: document.querySelector('#done'),
  addForm: document.querySelector('.form-add'),
  addTitle: document.querySelector('#add-title'),
  updateForm: document.querySelector('.form-update'),
  updateTitle: document.querySelector('#update-title'),
  idUpdate: document.querySelector('#id-update')
}

function listTasks(rows){
  dom.ToDo.innerHTML = '';
  dom.Done.innerHTML = '';
  rows.map(row => {
    let article = document.createElement('article');
    let txt = document.createElement('p');
    let span = document.createElement('span');
    let btnOne = document.createElement('button');
    let btnTwo = document.createElement('button');
    let btnThree = document.createElement('button');

    txt.innerHTML = row.Title;
    btnOne.id = row.Done ? 'btn-undone' : 'btn-done';
    btnTwo.id = 'btn-update';
    btnThree.id = 'btn-delete';

    btnOne.setAttribute('onclick', row.Done ? `undone(${row.idTaskTable})` : `done(${row.idTaskTable})`);
    btnTwo.setAttribute('onclick', `update(${row.idTaskTable})`);
    btnThree.setAttribute('onclick', `deleteTask(${row.idTaskTable})`);

    article.appendChild(txt);
    span.appendChild(btnOne);
    span.appendChild(btnTwo);
    span.appendChild(btnThree);
    article.appendChild(span);

    if(row.Done){
      dom.Done.appendChild(article);
    }else{
      dom.ToDo.appendChild(article);
    }
    
  })
}

function displayLists(lists){
  dom.List.innerHTML = '';
  lists.map(row => {
    let btn = document.createElement('button');
    btn.textContent = row.Title;
    btn.setAttribute('onclick', `openList(${row.idList})`)
    dom.List.appendChild(btn);
  })
}

const done = (id) => {
  ipc.send('setDone', id);
  ipc.on('DoneChanged', (evt, rows) => {
    listTasks(rows);
  })
}

const undone = (id) => {
  ipc.send('setUndone', id);
  ipc.on('undoneChanged', (evt, rows) => {
    listTasks(rows);
  })
}

const update = (id) => {
  openUpdateForm();
  ipc.send('getTaskById', id);
  ipc.on('sendTask', (evt, row) => {
    dom.updateTitle.value = row[0].Title;
    dom.idUpdate.value = row[0].idTaskTable;
  })
}

const deleteTask = (id) => {
  ipc.send('deleteTask', id);
  ipc.on('taskDeleted', (evt, rows) => {
    listTasks(rows);
  })
}

const openList = (id) => {
  console.log(id);
}


document.addEventListener('DOMContentLoaded', () => {
  ipc.send('loaded', 'iniciou');
  ipc.on('firstLoaded', (evt, rows) => {
    console.log(rows);
    displayLists(rows);
  })
})

document.querySelector('#delete-all').addEventListener('click', () => {
  if(confirm('Certeza que deseja excluir as tarefas feitas?')){
    ipc.send('deleteAll');
    ipc.on('allDeleted', (evt, rows) => {
      listTasks(rows);
    })
  }
})

dom.addForm.addEventListener('submit', (event) => {
  ipc.send('addTask', dom.addTitle.value);
  ipc.on('added', (evt, rows) => {
    listTasks(rows);
  })
  dom.addTitle.value = '';
  event.preventDefault();
})

dom.updateForm.addEventListener('submit', (event) => {
  ipc.send('updateTask', [dom.updateTitle.value, dom.idUpdate.value]);
  ipc.on('updated', (evt, rows) => {
    listTasks(rows);
  })
  event.preventDefault();
})