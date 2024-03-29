import { format, isThisWeek, isToday } from 'date-fns'
import project from './project'
import task from './task'
import showAside from './sidebar'


const localStorageList = (function (){
   const LSL = 'project.list'
    return LSL
})()
let array = (function (){
    let createArray = JSON.parse(localStorage.getItem(localStorageList)) || []
    return createArray
})()
const localStorageListId = (function () {
    const LSLI = 'project.list.id'
    return LSLI
})()
let selectedId = (function () {
    const selected = localStorage.getItem(localStorageListId)
    return selected
})()

function createProject() {
    const projectPop = document.querySelector('.project-pop')
    const projectInp = document.querySelector('.project-input')
    clickProjectBtn(projectPop)
    addProject(projectPop,projectInp)
    closeProjectBtn(projectPop,projectInp)
}
function clickProjectBtn(pop){
    const addProcejtBtn = document.querySelector('#addProjectBtn')
    addProcejtBtn.addEventListener('click',() => {
        PopHandler(pop,'project-pop','project-pop-active')
        PopHandler(addProcejtBtn,'addProjectBtn','addProjectBtn-active')
    })
}
function addProject(btn,inp) {
    const projectAddBtn = document.querySelector('.project-add')
    const addProjectBtn = document.querySelector('#addProjectBtn')
    projectAddBtn.addEventListener('click',() => {
        if(inp.value < 1 )return 
        PopHandler(btn,'project-pop-active','project-pop')
        PopHandler(addProjectBtn,'addProjectBtn-active','addProjectBtn')
        array.push(new project(inp.value, Date.now().toString(), []))
        saveAndRender()
        inp.value = ''
    })
}
function renderProjects() {
    const projectHolder = document.querySelector('.project')
    clearElement(projectHolder)
    checkBtn()
    array.forEach((list) => {
        const projectName = document.createElement('div')
        projectName.classList.add('project-list')
        const text = document.createElement('p')
        const btn = deleteProjectBtn()
        text.innerText = list.title
        projectName.dataset.listId = list.id
        if(list.id === selectedId){
        btn.style.display = 'flex'
        switchActive(projectName)
        }
        projectName.appendChild(createIcon('fa-angle-right'))
        projectName.appendChild(text)
        projectName.appendChild(btn)
        projectHolder.appendChild(projectName)
    });
}
function deleteProjectBtn() {
    const deleteBtn = document.createElement('button')
    deleteProjectFromList(deleteBtn)
    const trash = document.createElement('span')
    trash.classList.add('fas')
    trash.classList.add('fa-trash')
    deleteBtn.classList.add('delete-project-btn')
    deleteBtn.appendChild(trash)
    return deleteBtn
} 
function deleteProjectFromList(btn) {
    btn.addEventListener('click',() => {
        array = array.filter((item) => item.id !==selectedId)
        selectedId = null
        saveAndRender() 
        checkBtn()     
    })
}
function save(){
    localStorage.setItem(localStorageList,JSON.stringify(array))
    localStorage.setItem(localStorageListId,selectedId)
}
function saveAndRender() {
    save()
    renderProjects()
    createTask()
}
function selectProject() {
    const project = document.querySelector('.project')
    project.addEventListener('click',(item) => {
        
        if(array.length == 0){ hideBtn() }
        if(item.target.classList.contains('project-list')) {
            selectedId = item.target.dataset.listId
            
            checkBtn()
            saveAndRender()
        }
    })
}
function closeProjectBtn(btn,inp) {
    const close = document.querySelector('.project-close')
    const addProcejtBtn = document.querySelector('#addProjectBtn')
    close.addEventListener('click',() => {
        PopHandler(btn,'project-pop-active','project-pop')
        PopHandler(addProcejtBtn,'addProjectBtn-active','addProjectBtn')
        inp.value = ''
        
    })
}
function renderTasks() {
    const addTaskBtn = document.querySelector('.add-task')
    cleanTasks()
    addTaskBtn.addEventListener('click',() => {
        addTasktoArray()
    })
    submitForm()
}
function addTasktoArray() {
    const overlay = document.querySelector('#overlay')
    showForm()
    PopHandler(overlay,'overlay','overlay-active')
}
function submitForm() { 
    const overlay = document.querySelector('#overlay')
    const form = document.querySelector('#form')
    form.addEventListener('submit',(event) => {
        event.preventDefault()
        PopHandler(overlay,'overlay-active','overlay')
        PopHandler(form,'form','form-active')
        createTaskListElement(determineColor())
    })
}

function createTaskListElement(color) {
    array.forEach((item) => { 
        if(item.id == selectedId){
            item.task.push(new task(Date.now().toString(), nameInp.value, dateInp.value, descInp.value, color))
            saveAndRender() 
        }
            createTask()
        })  
}
function createTask() {
    cleanTasks()
    array.forEach((element) => {
       element.task.forEach((item) => {
        if(element.id === selectedId){
            renderAllTask(item)
   }
       })
 
   })
}

function renderAllTask(item) {
    const taskHolder = document.querySelector('.task-contanier')
    const taskItem = document.createElement('div')
    const div = document.createElement('div')
    div.classList.add('wrapper')
    taskItem.dataset.taskId = item.id
    taskItem.classList.add('task-item')
    const text = document.createElement('h3')
    text.innerText = item.name
    
    changeColor(taskItem)
    
    const dueDateText = document.createElement('p')
    dueDateText.innerText = format(new Date(item.dueDate),'MMM/io')
    const editBtn = createBtn('fa-edit')
    editBtn.classList.add('edit-btn')
    clickEditBtn(editBtn)
    const deleteBtn = createBtn('fa-ban')  
    deleteTask(deleteBtn)
    
    taskItem.appendChild(text) 
    div.appendChild(dueDateText)
    div.appendChild(editBtn)
    div.appendChild(deleteBtn)
    taskItem.appendChild(div)
    taskHolder.appendChild(taskItem)
}
function renderToday() {
    const today = document.querySelector('.today')
    today.addEventListener('click', () => {
        switchActive(today)
        hideBtn()
        cleanTasks()
        checkToday()
    })
}
function checkToday() {
    array.forEach((element) => {
        element.task.forEach((item) => {
           const date = new Date(item.dueDate)
            if(isToday(date)){
            renderAllTask(item)
            }
        })
    })
}
function renderInbox() {
    const inbox = document.querySelector('.inbox')
    inbox.addEventListener('click',() => {
        hideBtn()
        switchActive(inbox)
        cleanTasks()
        array.forEach((element) => {
            element.task.forEach((item) => {
            renderAllTask(item)
        })})
    })
}
function renderWeek() {
    const week = document.querySelector('.week')
    week.addEventListener('click', () => {
    hideBtn()
    switchActive(week)
    cleanTasks()
    array.forEach((element) => {
        element.task.forEach((item) => {
        const date = new Date(item.dueDate)
        if(isThisWeek(date)) {
            renderAllTask(item)
        }
    })
})
})
}
function switchActive(item) {
    const project = document.querySelectorAll('.project-list')
    project.forEach((item) => item.classList.remove('active'))
    item.classList.add('active')
}

function PopHandler(item,deActive,active) {
    item.classList.remove(deActive)
    item.classList.add(active)
}
function createBtn(name) {
    const btn = document.createElement('button')
    btn.classList.add('fas')
    btn.classList.add(name)
    return btn
}
function clearElement(elem) {
    while(elem.firstChild){
        elem.removeChild(elem.firstChild)
    }
}
function showForm() {
    const form = document.querySelector('.form-active')
    PopHandler(form,'form-active','form')
    if(form.classList.contains('form'))return
}
function determineColor() {
    const low = document.querySelector('#low2')
    const medium = document.querySelector('#medium2')
    const hard = document.querySelector('#hard2')
    if(low.checked){ return 'low' }
    else if(medium.checked){ return 'medium' }
    else if(hard.checked){ return 'hard' }
}
function changeColor(taskItem) {
    array.forEach((element) => {
    element.task.forEach((item) => {
        if(item.id == taskItem.dataset.taskId){
            if(item.priority === 'low'){ taskItem.style.backgroundColor = 'var(--yellow)' }
            else if(item.priority === 'medium'){ taskItem.style.backgroundColor = 'var(--orange)' }
            else if(item.priority === 'hard'){ taskItem.style.backgroundColor = 'var(--red)' }             
        }
        }) 
    })     
}
function deleteTask(btn) {    
    btn.addEventListener('click', (event) => {    
       array.forEach((element)=>{
           element.task.forEach((item)=>{            
               if(item.id === event.target.parentNode.parentNode.dataset.taskId){ 
                    element.task = element.task.filter((list) => list.id !== event.target.parentNode.parentNode.dataset.taskId)
                    saveAndRender()
               }
           })
       })
    })
}
function clickEditBtn(btn) {
    btn.addEventListener('click', (event) => {
        renderEdit(event)
    })
}
function renderEdit (event) {
    const editTemp = document.querySelector('#temp')
    const main = document.querySelector('#main')
    const templateItem = document.importNode(editTemp.content,true)
    const formEdit = templateItem.querySelector('form')
    const nameInp2 = templateItem.querySelector('.nameInp2')
    const descInp2 = templateItem.querySelector('.descInp2')
    const dueDateInp2 = templateItem.querySelector('.dueDateInp2')
    const low = templateItem.querySelector('#low')
    const medium = templateItem.querySelector('#medium')
    const hard = templateItem.querySelector('#hard')
    detectPriority(event,low,medium,hard)
    assingValues(event,nameInp2,descInp2,dueDateInp2)
    submitEditForm(event,formEdit,nameInp2,descInp2,dueDateInp2)
    showEditPop(formEdit)
    main.appendChild(formEdit)
}
function submitEditForm(event,form,name,desc,date) {
    const main = document.querySelector('#main')
    array.forEach((element) => element.task.forEach((item) => {
        if(item.id === event.target.parentNode.parentNode.dataset.taskId){
        form.addEventListener('submit', (event) => {
        event.preventDefault()
        hideEditPop(form)
        changeTask(item,name,desc,date)
        main.removeChild(form)
    })
        }
    }))
}
function assingValues(event,name,desc,dueDate) {
    array.forEach(element=>element.task.forEach(item=>{
        if(item.id === event.target.parentNode.parentNode.dataset.taskId){
            name.value = item.name
            desc.value = item.description
            dueDate.value = item.dueDate
        }   
    }))
}
function detectPriority(event,low,medium,hard) {
    array.forEach((element) => element.task.forEach((item) => {
        if(item.id === event.target.parentNode.parentNode.dataset.taskId){  
             if(item.priority == 'low'){
                low.checked = true
            }
            else if(item.priority == 'medium'){
                medium.checked = true
            }
            else if(item.priority == 'hard'){
                hard.checked = true
            } 
        }
    }))
}
function changeTask(item,name,desc,date) {
    console.log(item,name,desc,date)
    item.name = name.value
    item.description = desc.value
    item.dueDate = date.value
    const btns = document.querySelectorAll('.radioBtn') 
    const arr = Array.from(btns)
    let checked = arr.find(elem=>elem.checked)
    item.priority = checked.id
    saveAndRender()
}
function showEditPop(formEdit) {
    const overlay = document.querySelector('#overlay')
    PopHandler(formEdit,'edit-form-active','edit-form')
    PopHandler(overlay,'overlay','overlay-active')
}
function hideEditPop(form) {
    const overlay = document.querySelector('#overlay')
    PopHandler(overlay,'overlay-active','overlay')
    PopHandler(form,'edit-form','edit-form-edit')
}
function hideBtn() {
    const btn = document.querySelector('.add-task')
    btn.classList.remove('show-btn')
    btn.classList.add('hide-btn')
}
function checkBtn () {
    const btn = document.querySelector('.add-task') 
    if(selectedId == 'null'){
        btn.classList.remove('show-btn')
        btn.classList.add('hide-btn')
    } else{
        btn.classList.remove('hide-btn')
        btn.classList.add('show-btn')
    }
}
function createIcon(item) {
    const icon = document.createElement('span')
    icon.classList.add('fas')
    icon.classList.add(item)
    return icon
}
function cleanTasks(){
    const taskHolder = document.querySelector('.task-contanier')
    clearElement(taskHolder)
}
function renderPage(){
    createProject()
    window.addEventListener('load', () => {
        saveAndRender()
        renderTasks()
        createTask()
        hideBtn()
        checkBtn()
    })
    selectProject()
    renderWeek()
    renderToday()
    renderInbox()
    showAside()
}

export default renderPage
