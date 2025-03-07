const coupon_name_el = document.querySelector("#name");
const coupon_code_el = document.querySelector("#couponCode");
const coupon_maxuses_el = document.querySelector("#maxUses");
const coupon_minpurchase_el = document.querySelector("#minPurchase");
const coupon_expirydate_el = document.querySelector("#expiryDate");
const coupon_start_el = document.querySelector("#startDate");
const offerAmount_el = document.querySelector("#offerAmount");
const addcoupon_btn_el = document.querySelector("#add-btn");

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
 let isValid=true

  //validation//

  if (coupon_name_el?.value == "") {
    createErrElAfter(coupon_name_el, "coupon name can not be empty");
    isValid = false;
  }

  if (coupon_name_el?.value.length >=20) {
    createErrElAfter(coupon_name_el, "coupon name cannot be longer than 20");
    isValid = false;
  }

  if (/\d/.test(coupon_name_el.value)) {

    createErrElAfter(coupon_name_el, "coupon name cannot be numbers");
    isValid = false;
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(coupon_name_el.value)) {
    createErrElAfter(coupon_name_el, " this field cannot be special char ");
    isValid = false;
  }
if (!isValid) {
    return
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
        alert('success')
    }
} catch (error) {
    console.log(error);
    
}


});



