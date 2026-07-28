
export function toggleTheme(){
 document.body.classList.toggle('light');
 localStorage.setItem('theme',
 document.body.classList.contains('light')?'light':'dark');
}
