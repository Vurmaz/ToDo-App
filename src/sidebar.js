function showAside () {
    const btn = document.querySelector('.navbar-btn')
    const aside = document.querySelector('.aside')
    btn.addEventListener('click',() => {
        aside.classList.toggle('show-sidebar')
    })
}
export default showAside