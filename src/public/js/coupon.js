 
const removeModalOpenEl = document.querySelector('.remove-icon');
const couponInfoModal = document.getElementById('couponInfoModal');
const removeCouponCloseBtn = document.getElementById('removeCouponCloseBtn');
const remove_btn=document.querySelector('.remove-btn')
const modal = new bootstrap.Modal(couponInfoModal);

removeModalOpenEl.addEventListener('click', (e) => {
  e.preventDefault();
  modal.show();
});
remove_btn.addEventListener('click',async(e)=>{
  try {
    
    console.log(remove_btn,'remove');
    
    const response=await fetch('/remove-coupon',{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
        body:JSON.stringify({})
      }

    })
    if (response.ok) {
      Swal.fire({
            position: "center",
            icon: "success",
            title: 'coupon removed',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload();
            modal.hide();
          });
    }
  } catch (error) {
    console.log(error);
    modal.hide();
    
  }
})

