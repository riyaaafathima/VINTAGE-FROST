const email_el = document.querySelector('#email')

const password_el = document.querySelector('#password')

const err_password_el=document.querySelector('#err-password')

const err_email_el=document.querySelector('#err-email')

const btn_el= document.querySelector('.login-btn')


console.log(err_password_el,password_el,btn_el);


btn_el.addEventListener('click', async(e)=>{
    e.preventDefault()

let isValid=true

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!emailRegex.test(email_el.value)) {
  err_email_el.innerHTML = "please enter a valid  email";
  isValid = false;
}

    if (!/[a-z]/.test(password_el.value)) {
        err_password_el.innerHTML='Include at least one lowercase letter.'
        isValid=false
      }
    
      if (!/[A-Z]/.test(password_el.value)) {
       err_password_el.innerHTML='Include at least one uppercase letter.'
       isValid=false
      }
      
      // Check for at least one digit
      if (!/\d/.test(password_el.value)) {
        err_password_el.innerHTML='Include at least one number.'
        isValid=false
      }
      
      // Check for at least one special character
      if (!/[@$!%*?&]/.test(password_el.value)) {
        err_password_el.innerHTML='Include at least one special character (@, $, !, %, *, ?, &).'
        isValid=false
      }
      
      // Check for minimum length of 6 characters
      if (password_el.value.length < 6) {
        err_password_el.innerHTML='Password must be at least 6 characters long.'
        isValid=false
      }
    
      if (!isValid) {
        return
      }
      const userCredential={
        email:email_el.value,
        password:password_el.value
    }
    

    const response =  await fetch('/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
    
        },
        body:JSON.stringify(userCredential),
    
    });

    if (response.ok) {
        const result= await response.json()
        console.log(result);

        window.location.href = result.redirecturl
        
    }else{  

        const mssg= await response.json()

        swal.fire('invalid credential')
    }

    
})


email_el.addEventListener('focus',()=>{
    err_email_el.innerHTML='';
})

password_el.addEventListener('focus',()=>{
    err_password_el.innerHTML='';
}
)






