const category_name_el = document.querySelector("#name");
const expirydate_el = document.querySelector("#expiryDate");
const  offerpercentge_el= document.querySelector("#offerAmount");
const edit_addcoupon_btn_el = document.querySelector("#add-btn");
const offerId=edit_addcoupon_btn_el.getAttribute('data-id')
console.log(offerId);
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
edit_addcoupon_btn_el.addEventListener("click", async (e) => {
  e.preventDefault();
let isValid=true;
  const expiryDate = new Date(expirydate_el?.value);
  if (!expirydate_el?.value) {
    createErrElAfter(expirydate_el, "Expiry date cannot be empty.");
    isValid = false;
  }
  if(!isValid){
  return
  }

  const editedoffer = {

    category_id: category_name_el.value,
    offerPercentage: offerpercentge_el.value,
    expiryDate: expirydate_el.value,
  };
  console.log(editedoffer);

  try {
    const response = await fetch(`/admin/update-categoryOffer-page/${offerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedoffer),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        swal.fire("successfully edited").then(() => {
            window.location.href = "/admin/categoryOffer-page";
        });
    }
  } catch (error) {
    console.log(error);
  }
});
