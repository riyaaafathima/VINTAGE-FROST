const coupon_name_el = document.querySelector("#name");
const coupon_code_el = document.querySelector("#couponCode");
const coupon_maxuses_el = document.querySelector("#maxUses");
const coupon_minpurchase_el = document.querySelector("#minPurchase");
const coupon_expirydate_el = document.querySelector("#expiryDate");
const coupon_start_el = document.querySelector("#startDate");
const offerAmount_el = document.querySelector("#offerAmount");
const addcoupon_btn_el = document.querySelector("#add-btn");
const couponValue = coupon_code_el.value;

console.log(addcoupon_btn_el);

const createErrElAfter = (element, err) => {
  if (element?.nextElementSibling?.id == "erro_el") {
    element.nextElementSibling.remove();
  }
  const new_el = document.createElement("p");
  new_el.setAttribute("id", "erro_el");
  new_el.style.color = "red";
  new_el.innerHTML = err;
  element.after(new_el);
};




addcoupon_btn_el.addEventListener("click", async(e) => {
  e.preventDefault();
 let isValid=true;
  
    
    // Coupon Name Validation
    if (coupon_name_el?.value == "") {
      createErrElAfter(coupon_name_el, "coupon name can not be empty");
      isValid = false;
    }
    if (coupon_name_el?.value.length > 20) {
      createErrElAfter(coupon_name_el, "coupon name cannot be longer than 20");
      isValid = false;
    }
    if (/\d/.test(coupon_name_el.value)) {
      createErrElAfter(coupon_name_el, "coupon name cannot be numbers");
      isValid = false;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(coupon_name_el.value)) {
      createErrElAfter(coupon_name_el, "this field cannot contain special characters");
      isValid = false;
    }
  
    // Coupon Code Validation
    const couponValue = coupon_code_el?.value?.trim();
    if (!couponValue) {
      createErrElAfter(coupon_code_el, "Coupon code cannot be empty.");
      isValid = false;
    
    } else if (!/[A-Z]/.test(couponValue)) {
      createErrElAfter(coupon_code_el, "Coupon code must have at least one uppercase letter.");
      isValid = false;
    } else if (!/[a-z]/.test(couponValue)) {
      createErrElAfter(coupon_code_el, "Coupon code must have at least one lowercase letter.");
      isValid = false;
    } else if (!/[0-9]/.test(couponValue)) {
      createErrElAfter(coupon_code_el, "Coupon code must have at least one number.");
      isValid = false;
    } else if (couponValue.length < 8) {
      createErrElAfter(coupon_code_el, "Coupon code must be at least 8 characters long.");
      isValid = false;
    }
  
    // Date Validation
    if (coupon_expirydate_el?.value == "") {
      createErrElAfter(coupon_expirydate_el, "date field cannot be empty");
      isValid = false;
    }
    if (coupon_start_el?.value == "") {
      createErrElAfter(coupon_start_el, "date field cannot be empty");
      isValid = false;
    }
  
    // Minimum Purchase Amount Validation
    if (coupon_minpurchase_el?.value == "") {
      createErrElAfter(coupon_minpurchase_el, "this field cannot be empty");
      isValid = false;
    }
  
    // Offer Amount Validation
    if (offerAmount_el?.value == "") {
      createErrElAfter(offerAmount_el, "this field cannot be empty");
      isValid = false;
    }
  
    // Max Uses Validation
    if (coupon_maxuses_el?.value == "") {
      createErrElAfter(coupon_maxuses_el, "this field cannot be empty");
      isValid = false;
    }
  
    if (!isValid) {
      return;
    }
    
    
    const couponCredentials={
      name:coupon_name_el.value,
      couponCode:coupon_code_el.value,
      expiryDate:coupon_expirydate_el.value,
      offerAmount:offerAmount_el.value,
      startDate:coupon_start_el.value,
      minimumPurchaseAmount:coupon_minpurchase_el.value,
      maximumUses:coupon_maxuses_el.value,
    }
    console.log(couponCredentials);
    
    
    try {
      
      const response=await fetch('/admin/coupon-page',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(couponCredentials)
      })
      
      
      if (response.ok) {
        swal.fire(" coupon added successfully ").then(() => {
          // window.location.href = "/admin/coupon-page";
          window.location.reload()
      });      }
    } catch (error) {
      console.log(error);
      
    }
    
  });





coupon_name_el.addEventListener('focus',(e)=>{
  
  if (coupon_name_el?.nextElementSibling?.id == "erro_el") {
      coupon_name_el.nextElementSibling.remove();
  }
})
coupon_code_el.addEventListener('focus',(e)=>{

  if (coupon_code_el?.nextElementSibling?.id == "erro_el") {
    coupon_code_el.nextElementSibling.remove();
  }
})
coupon_maxuses_el.addEventListener('focus',(e)=>{

  if (coupon_maxuses_el?.nextElementSibling?.id == "erro_el") {
    coupon_maxuses_el.nextElementSibling.remove();
  }
})

coupon_expirydate_el.addEventListener('focus',(e)=>{

  if (coupon_expirydate_el?.nextElementSibling?.id == "erro_el") {
    coupon_expirydate_el.nextElementSibling.remove();
  }
})

coupon_start_el.addEventListener('focus',(e)=>{

  if (coupon_start_el?.nextElementSibling?.id == "erro_el") {
    coupon_start_el.nextElementSibling.remove();
  }
})

coupon_minpurchase_el.addEventListener('focus',(e)=>{

  if (coupon_minpurchase_el?.nextElementSibling?.id == "erro_el") {
    coupon_minpurchase_el.nextElementSibling.remove();
  }
})
offerAmount_el.addEventListener('focus',(e)=>{

  if (offerAmount_el?.nextElementSibling?.id == "erro_el") {
    offerAmount_el.nextElementSibling.remove();
  }
})
