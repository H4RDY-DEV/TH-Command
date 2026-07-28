
document.getElementById('login').onsubmit=e=>{
e.preventDefault();
localStorage.setItem('th_logged_in','1');
location.href='./index.html#dashboard';
};
