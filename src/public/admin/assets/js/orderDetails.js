const status_btn_el=document.querySelectorAll('.status-change-btn')
console.log(status_btn_el);


status_btn_el.forEach((btn)=>{
    btn.addEventListener('click',async(e)=>{
        e.preventDefault()
        const orderId = btn.getAttribute('order-id');
      const productId = btn.getAttribute('product-id');
      const status = btn.getAttribute('data-status');



      try {
        const response=await fetch(`/admin/update-status/${orderId}/${productId}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({status})
        })
       if(response.ok){
        alert('stattus updated')
        window.location.reload()

       }else{
        alert('somethimg wrong')
       }
  
      } catch (error) {
        console.log(error);
        
      }
    })
})
