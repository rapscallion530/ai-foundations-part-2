import './style.css'

const CHECKLIST_KEY = 'ai-lab-notes-checklist-v1'
const NOTES_KEY = 'ai-lab-notes-entries-v1'

const setupItems = [
  'Open a terminal and confirm the current folder with pwd',
  'Check that Node.js is installed with node --version',
  'Check that Git is installed with git --version',
  'Install this project with npm install',
  'Start the development server with npm run dev',
  'Open the local address shown in the terminal',
]

const checklist = document.querySelector('#checklist')
const checklistProgress = document.querySelector('#checklist-progress')
const resetChecklistButton = document.querySelector('#reset-checklist')
const notesForm = document.querySelector('#notes-form')
const notesList = document.querySelector('#notes-list')
const noteCount = document.querySelector('#note-count')
const formStatus = document.querySelector('#form-status')

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

let completedItems = readStorage(CHECKLIST_KEY, [])
let notes = readStorage(NOTES_KEY, [])

function renderChecklist() {
  checklist.replaceChildren()

  setupItems.forEach((item, index) => {
    const label = document.createElement('label')
    label.className = 'checklist-item'

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.checked = completedItems.includes(index)
    input.addEventListener('change', () => {
      completedItems = input.checked
        ? [...new Set([...completedItems, index])]
        : completedItems.filter((itemIndex) => itemIndex !== index)
      writeStorage(CHECKLIST_KEY, completedItems)
      updateChecklistProgress()
    })

    const text = document.createElement('span')
    text.textContent = item
    label.append(input, text)
    checklist.append(label)
  })

  updateChecklistProgress()
}

function updateChecklistProgress() {
  checklistProgress.textContent = `${completedItems.length} of ${setupItems.length}`
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? dateString
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function addTextElement(parent, tag, className, text) {
  const element = document.createElement(tag)
  element.className = className
  element.textContent = text
  parent.append(element)
  return element
}

function renderNotes() {
  notesList.replaceChildren()
  noteCount.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`

  if (notes.length === 0) {
    addTextElement(notesList, 'p', 'empty-state', 'No notes yet. Save a fictional experiment above.')
    return
  }

  notes.forEach((note) => {
    const article = document.createElement('article')
    article.className = 'note'

    const header = document.createElement('div')
    header.className = 'note-header'
    const headingGroup = document.createElement('div')
    addTextElement(headingGroup, 'p', 'note-meta', `${note.topic} · ${formatDate(note.date)}`)
    addTextElement(headingGroup, 'h4', '', note.title)

    const removeButton = document.createElement('button')
    removeButton.className = 'delete-button'
    removeButton.type = 'button'
    removeButton.textContent = 'Delete'
    removeButton.setAttribute('aria-label', `Delete ${note.title}`)
    removeButton.addEventListener('click', () => {
      notes = notes.filter((entry) => entry.id !== note.id)
      writeStorage(NOTES_KEY, notes)
      renderNotes()
    })

    header.append(headingGroup, removeButton)
    article.append(header)
    addTextElement(article, 'p', 'note-observation', note.observation)
    if (note.nextStep) {
      addTextElement(article, 'p', 'next-step', `Next: ${note.nextStep}`)
    }
    notesList.append(article)
  })
}

resetChecklistButton.addEventListener('click', () => {
  completedItems = []
  writeStorage(CHECKLIST_KEY, completedItems)
  renderChecklist()
})

notesForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(notesForm)
  const note = {
    id: crypto.randomUUID(),
    title: formData.get('title').trim(),
    date: formData.get('date'),
    topic: formData.get('topic'),
    observation: formData.get('observation').trim(),
    nextStep: formData.get('nextStep').trim(),
  }

  notes = [note, ...notes]
  if (!writeStorage(NOTES_KEY, notes)) {
    notes.shift()
    formStatus.textContent = 'This browser could not save the note. Check localStorage settings.'
    return
  }

  notesForm.reset()
  notesForm.elements.date.valueAsDate = new Date()
  formStatus.textContent = 'Lab note saved in this browser.'
  renderNotes()
})

notesForm.addEventListener('reset', () => {
  window.setTimeout(() => {
    notesForm.elements.date.valueAsDate = new Date()
    formStatus.textContent = ''
  })
})

notesForm.elements.date.valueAsDate = new Date()
renderChecklist()
renderNotes()
