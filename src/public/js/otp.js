const otp_el = document.querySelectorAll(".otp-input");

const btn_el = document.getElementById("otp-btn");

const otp_parent_el=document.querySelector('.OTP-inputs')


 window.onload=()=>{
  otp_parent_el.firstElementChild.focus()
  
 }

 for (const [index, el] of Object.entries(otp_parent_el.children)) {
  console.log(el,'ertyu');
  
  el.addEventListener("input", (e) => {
    el.value = el.value.slice(0,1)
    if(el.value.length === 1){
        Number(index) !== otp_parent_el.children.length - 1 && el.nextElementSibling.focus();
    }
  });
  el.addEventListener('keydown',(e)=>{
    setTimeout(() => {
        if(e.key === 'Backspace'){
            Number(index) !== 0 && el.previousElementSibling.focus()
        }
    }, 0);
  })
}




btn_el.addEventListener("click", async (e) => {
  e.preventDefault();
  let inputData = "";

  otp_el.forEach((el) => {
    inputData += el.value
    
    
  });


  console.log(inputData);
  


  const response= await fetch('/otp-page',{
    method:'POST',
    headers:{
        'content-Type':'application/json'
    },
    body:JSON.stringify({inputData}),
  });

  if(response.ok){
    window.location.href='/home-page'
  }else{
    const mssg= await response.json()
    swal.fire(mssg);
    console.log(mssg);
    
  }
});


