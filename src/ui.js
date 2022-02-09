function showAside () {
    const btn = document.querySelector('.navbar-btn')
    const aside = document.querySelector('.aside')
    const addTask = document.querySelector('.add-task')
    btn.addEventListener('click',() => {
        aside.classList.toggle('show-sidebar')
        addTask.classList.toggle('hide-btn')
    })
}
export default showAside