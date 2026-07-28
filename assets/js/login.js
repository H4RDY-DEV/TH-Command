if(localStorage.getItem('th_command_session')) location.replace('/');
document.querySelector('#login-form').addEventListener('submit',event=>{
  event.preventDefault();
  const email=document.querySelector('#email').value.trim();
  const password=document.querySelector('#password').value;
  if(!email.includes('@')||!password){
    const error=document.querySelector('#login-error'); error.hidden=false; error.textContent='Enter a valid email address and password.'; return;
  }
  localStorage.setItem('th_command_session',JSON.stringify({email,loggedInAt:new Date().toISOString()}));
  location.replace('/');
});
