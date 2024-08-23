let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group');
}

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};
//changes here

// const getNotes = () =>
//   fetch('/apiRoutes/notes', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });

const getNotes = () => fetch('/api/notes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

//here

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const deleteNote = (id) =>
  fetch(`/apiRoutes/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    getNotes().then(renderNoteList);
    renderActiveNote();
  });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target.parentElement;
  const noteId = JSON.parse(note.dataset.note).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getNotes().then(renderNoteList);
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.dataset.note);
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

const handleRenderBtns = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent the default behavior of creating a new line
    handleNoteSave(); // Call the function to save the note
  } else {
    show(clearBtn);
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
      hide(clearBtn);
    } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  }
};
const renderNoteList = async (notes) => {
  //const notes = await getNotes();
  console.log("Server Request: ", notes)
  const jsonNotes = await notes.json();
  console.log("Response: ", jsonNotes)
  let jsNotes = JSON.parse(jsonNotes)

  noteList.innerHTML = '';

  //if (jsonNotes.length === 0) {
  if (jsNotes.length === 0) {
    noteList.innerHTML = '<li>No saved Notes</li>';
  }

 // jsonNotes.forEach((note) => {
  jsNotes.forEach((note) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `<span class="list-item-title">${note.title}</span>
                    <i class="fas fa-trash-alt float-right text-danger delete-note"></i>`;
    li.dataset.note = JSON.stringify(note);

    li.querySelector('.list-item-title').addEventListener('click', handleNoteView);
    li.querySelector('.delete-note').addEventListener('click', handleNoteDelete);

    noteList.appendChild(li);
  });
};

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);
  noteForm.addEventListener('keypress', handleRenderBtns); 
  getNotes().then(renderNoteList);
}