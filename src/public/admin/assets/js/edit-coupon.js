const edit_coupon_name_el = document.querySelector("#name");
const edit_coupon_code_el = document.querySelector("#couponCode");
const edit_coupon_maxuses_el = document.querySelector("#maxUses");
const edit_expiry_date_el = document.querySelector("#expiryDate");
const edit_strt_date_el = document.querySelector("#startDate");
const edit_min_purchase_el = document.querySelector("#minPurchase");
const edit_offer_amount_el = document.querySelector("#offerAmount");
const couponValue = edit_coupon_code_el.value;
const add_btn_el = document.querySelector("#update-btn");
const couponId = add_btn_el.getAttribute("data-id");

console.log(couponId);

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
  
  const clearErrors = () => {
    document.querySelectorAll("#erro_el").forEach(el => el.remove());
  };
  
  add_btn_el.addEventListener("click", async (e) => {
    e.preventDefault();
  
    // Clear existing errors
    clearErrors();
  
    let isValid = true;
  
    // Coupon Name Validation
    const couponName = edit_coupon_name_el?.value?.trim();
    if (!couponName) {
      createErrElAfter(edit_coupon_name_el, "Coupon name cannot be empty");
      isValid = false;
    } else if (couponName.length > 20) {
      createErrElAfter(edit_coupon_name_el, "Coupon name cannot be longer than 20 characters");
      isValid = false;
    } else if (/\d/.test(couponName)) {
      createErrElAfter(edit_coupon_name_el, "Coupon name cannot contain numbers");
      isValid = false;
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(couponName)) {
      createErrElAfter(edit_coupon_name_el, "Coupon name cannot contain special characters");
      isValid = false;
    }
  
    // Coupon Code Validation
    const couponValue = edit_coupon_code_el?.value?.trim();
    if (!couponValue) {
      createErrElAfter(edit_coupon_code_el, "Coupon code cannot be empty.");
      isValid = false;
    } else if (!/[A-Z]/.test(couponValue)) {
      createErrElAfter(edit_coupon_code_el, "Coupon code must have at least one uppercase letter.");
      isValid = false;
    } else if (!/[a-z]/.test(couponValue)) {
      createErrElAfter(edit_coupon_code_el, "Coupon code must have at least one lowercase letter.");
      isValid = false;
    } else if (!/[0-9]/.test(couponValue)) {
      createErrElAfter(edit_coupon_code_el, "Coupon code must have at least one number.");
      isValid = false;
    } else if (couponValue.length < 8) {
      createErrElAfter(edit_coupon_code_el, "Coupon code must be at least 8 characters long.");
      isValid = false;
    }
  
    // Date Validation
    const expiryDate = new Date(edit_expiry_date_el?.value);
    const startDate = new Date(edit_strt_date_el?.value);
    if (!edit_expiry_date_el?.value) {
      createErrElAfter(edit_expiry_date_el, "Expiry date cannot be empty.");
      isValid = false;
    } else if (!edit_strt_date_el?.value) {
      createErrElAfter(edit_strt_date_el, "Start date cannot be empty.");
      isValid = false;
    } else if (expiryDate < startDate) {
      createErrElAfter(edit_expiry_date_el, "Expiry date must be after start date.");
      isValid = false;
    }
  
    // Minimum Purchase Amount Validation
    const minPurchase = parseFloat(edit_min_purchase_el?.value);
    if (!edit_min_purchase_el?.value) {
      createErrElAfter(edit_min_purchase_el, "This field cannot be empty.");
      isValid = false;
    } else if (minPurchase < 0) {
      createErrElAfter(edit_min_purchase_el, "Minimum purchase amount cannot be less than 0.");
      isValid = false;
    }
  
    // Offer Amount Validation
    const offerAmount = parseFloat(edit_offer_amount_el?.value);
    if (!edit_offer_amount_el?.value) {
      createErrElAfter(edit_offer_amount_el, "This field cannot be empty.");
      isValid = false;
    } else if (offerAmount < 0) {
      createErrElAfter(edit_offer_amount_el, "Offer amount cannot be less than 0.");
      isValid = false;
    }
  
    if (!isValid) return;
    
    
    
    const editedCouponEl = {
        couponId: couponId,
        couponCode: edit_coupon_code_el.value,
        name: edit_coupon_name_el.value,
        expiryDate: edit_expiry_date_el.value,
        offerAmount: edit_offer_amount_el.value,
        startDate: edit_strt_date_el.value,
        minimumPurchaseAmount: edit_min_purchase_el.value,
        maximumUses: edit_coupon_maxuses_el.value,
    };
    try {
        const response = await fetch(`/admin/update-coupon/${couponId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedCouponEl),
            credentials: "include",
        });
        if (response.ok) {
            swal.fire("successfully edited").then(() => {
                window.location.href = "/admin/coupon-page";
            });
        }
    } catch (error) {
        console.log(error);
    }
});




edit_coupon_name_el.addEventListener('focus',(e)=>{
  
    if (edit_coupon_name_el?.nextElementSibling?.id == "erro_el") {
        edit_coupon_name_el.nextElementSibling.remove();
    }
})
edit_coupon_code_el.addEventListener('focus',(e)=>{
  
    if (edit_coupon_code_el?.nextElementSibling?.id == "erro_el") {
        edit_coupon_code_el.nextElementSibling.remove();
    }
})
edit_coupon_maxuses_el.addEventListener('focus',(e)=>{
  
    if (edit_coupon_maxuses_el?.nextElementSibling?.id == "erro_el") {
        edit_coupon_maxuses_el.nextElementSibling.remove();
    }
})

edit_expiry_date_el.addEventListener('focus',(e)=>{
  
    if (edit_expiry_date_el?.nextElementSibling?.id == "erro_el") {
    edit_expiry_date_el.nextElementSibling.remove();
    }
})

edit_strt_date_el.addEventListener('focus',(e)=>{
  
    if (edit_strt_date_el?.nextElementSibling?.id == "erro_el") {
        edit_strt_date_el.nextElementSibling.remove();
    }
})

edit_min_purchase_el.addEventListener('focus',(e)=>{
  
    if (edit_min_purchase_el?.nextElementSibling?.id == "erro_el") {
        edit_min_purchase_el.nextElementSibling.remove();
    }
})
edit_offer_amount_el.addEventListener('focus',(e)=>{
  
    if (edit_offer_amount_el?.nextElementSibling?.id == "erro_el") {
        edit_offer_amount_el.nextElementSibling.remove();
    }
})

