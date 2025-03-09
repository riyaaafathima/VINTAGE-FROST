const modal_open_coupon_el=document.querySelector('.coupon-modal')
const btn=document.querySelector('.btn-primary')
const apply_btn=document.querySelector('#apply-btn')
const radio_btn=document.querySelector('.radio-btn')
// const couponId=apply_btn.getAttribute('data-id')
// const couponcode_el=document.querySelector('.coupon-code')
const radio_buttons = document.querySelectorAll('.radio-btn')

console.log(apply_btn);

modal_open_coupon_el.addEventListener('click',(e)=>{
    e.preventDefault()
const modal = btn.getAttribute('data-bs-target')
modal.show()
})

// const couponCode=couponcode_el.value

apply_btn.addEventListener('click',async(e)=>{
    e.preventDefault()
console.log(apply_btn,'jhjhjhghug');

const selectedRadio = document.querySelector('.radio-btn:checked');
    if (!selectedRadio) {
        alert("Please select a coupon!");
        return;
    }
    const couponId = selectedRadio.getAttribute('data-id');
    const couponCode = selectedRadio.closest('.coupon-item').querySelector('.coupon-code').textContent.trim();
   console.log(couponCode,couponId);
   
   try {
    const response = await fetch('/coupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( {couponCode} ) 
    });

    if (response.ok) {
        const data = await response.json();
        alert(`Coupon Applied! Discount: ${data.discount}%`);
    } else {
        alert("Failed to apply coupon");
    }
} catch (error) {
    console.log(error);
}
})


