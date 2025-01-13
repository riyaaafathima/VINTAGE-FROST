const email_el = document.querySelector('#email')

const password_el = document.querySelector('#password')

const err_password_el=document.querySelector('#err-password')

const err_email_el=document.querySelector('#err-email')

const btn_el= document.querySelector('.login-btn')

console.log(err_password_el,password_el,btn_el);


btn_el.addEventListener('click', async(e)=>{
    e.preventDefault()

    const userCredential={
        email:email_el.value,
        password:password_el.value
    }
    
    
    if (password_el.value.length<6) {
     err_password_el.innerHTML='please enter your password'
     
        
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






