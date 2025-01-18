

const categoryName_el=document.querySelector('#categoryName')
const categoryStatus_el=document.querySelector('#status')
const add_btn_el=document.querySelector('#add-categorybtn')

console.log(category);



add_btn_el.addEventListener('click', async(e)=>{
    e.preventDefault()





    const createErrElAfter =(element,err)=>{
        if(element?.nextElementSibling?.id == 'erro_el' ){
          element.nextElementSibling.remove()
        }
        const new_el = document.createElement('p')
        new_el.setAttribute("id","erro_el")
        new_el.style.color = "red"
        new_el.innerHTML = err
        element.after(new_el)
      }
   
    if(categoryName_el?.value == ""){
        createErrElAfter(categoryName_el,"Must add category name")
        return
     }
     
     if(categoryName_el?.value.length >= 20){
       createErrElAfter(categoryName_el,"product name can not be longer than 20")
       return
     }

     console.log(category);
     
     const response= await fetch('/admin/update-category',{
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({categoryName:categoryName_el.value,_id:category._id})
     })

     if (response.ok) {
        swal.fire('successfully edited').then(()=>{
            window.location.href='/admin/add-category'        

        })
     }else{
        swal.fire('error')
        
     }

})     


