const place_el = document.querySelector("#place");
const state_el = document.querySelector("#state");
const phone_el = document.querySelector("#phoneNumber");
const landMark_el = document.querySelector("#landMark");
const address_el = document.querySelector("#address");
const address_type_el = document.querySelector("#adressType");
const pincode_el = document.querySelector("#pincode");
const locality_el = document.querySelector("#locality");
const city_el = document.querySelector("#city");
const save_address_btn = document.querySelector("#saveAddressBtn");
const remove_btn_el=document.querySelectorAll('.btn-remove')

//edit modal input elements
const edit_place_el = document.getElementById("edit-place");
const edit_state_el = document.getElementById("edit-state");
const edit_phone_el = document.getElementById("edit-phoneNumber");    
const edit_landMark_el = document.getElementById("edit-landMark");
const edit_address_el = document.getElementById("edit-address");
const edit_pincode_el = document.getElementById("edit-pincode");
const edit_locality_el = document.getElementById("edit-locality");
const edit_city_el = document.getElementById("edit-city");
const edit_address_type_el = document.querySelector("#edit-adressType");
const addressId = document.getElementById("addressId")
const save_EditAddress_Btn = document.querySelector("#saveEditAddressBtn");

document.querySelector("#add-Address-button")
  .addEventListener("click", function () {
    $("#addAddressModal").modal("show");
  });

  

save_address_btn.addEventListener("click", async function (e) {
  e.preventDefault();
  
  const createErrElAfter = (element, err) => {
    if (element?.nextElementSibling?.id == "erro_el") {
      element.nextElementSibling.remove();
    }
    const new_el = document.createElement("p");
    new_el.setAttribute("id", "erro_el");
    new_el.style.color = "red";
    new_el.innerHTML = err;
    element.after(new_el);

    
    element.addEventListener('focus', () => {
      if (element.nextElementSibling?.id == "erro_el") {
        element.nextElementSibling.remove();
      }
    });
  };

  let isValid = true;

  if (place_el?.value == "") {
    createErrElAfter(place_el, "this field can not be empty");
    isValid = false;
  }

  if (place_el?.value.length >= 50) {
    createErrElAfter(place_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (state_el?.value == "") {
    createErrElAfter(state_el, "this field can not be empty");
    isValid = false;
  }

  if (state_el?.value.length >= 20) {
    createErrElAfter(state_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (phone_el?.value == "") {
    createErrElAfter(phone_el, "this field can not be empty");
    isValid = false;
  }

  if (phone_el?.value.length >= 11) {
    createErrElAfter(phone_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(phone_el.value)) {
    createErrElAfter(phone_el, "product name cannot be special char");
    isValid = false;
  }
  if (landMark_el?.value == "") {
    createErrElAfter(landMark_el, "this field can not be empty");
    isValid = false;
  }

  if (landMark_el?.value.length >= 50) {
    createErrElAfter(landMark_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (address_el?.value == "") {
    createErrElAfter(address_el, "this field can not be empty");
    isValid = false;
  }
  if (pincode_el?.value.length >= 10) {
    createErrElAfter(pincode_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (pincode_el?.value == "") {
    createErrElAfter(pincode_el, "this field can not be empty");
    isValid = false;
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pincode_el.value)) {
    createErrElAfter(pincode_el, "this field cannot be special char");
    isValid = false;
  }
  if (locality_el?.value.length >= 10) {
    createErrElAfter(locality_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (/\d/.test(locality_el.value)) {
    //d4 digit
    createErrElAfter(locality_el, "this field cannot be numbers");
    isValid = false;
  }
  if (locality_el?.value == "") {
    createErrElAfter(locality_el, "this field can not be empty");
    isValid = false;
  }
  if (city_el?.value.length >= 10) {
    createErrElAfter(city_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (/\d/.test(city_el.value)) {
    //d4 digit
    createErrElAfter(city_el, "this field cannot be numbers");
    isValid = false;
  }
  if (city_el?.value == "") {
    createErrElAfter(city_el, "this field can not be empty");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const addressDetails = {
    place: place_el.value,
    state: state_el.value,
    phone: phone_el.value,
    landmark: landMark_el.value,
    address: address_el.value,
    addressType: address_type_el.value,
    pincode: pincode_el.value,
    locality: locality_el.value,
    city: city_el.value,
  };
  try {
        const response = await fetch("/save-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressDetails),
        });
    
        if (response.ok) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "saved changes",
            showConfirmButton: false,
            timer: 1500,
          }).then(()=>{
            $("#addAddressModal").modal("hide");
            location.reload();
          })
         
        } else {
          alert("failed to save address");
        }
      } catch (error) {
        console.log(error);
      }


});


const editBtns = document.querySelectorAll(".edit-button");

editBtns.forEach((editbtn) => {
  editbtn.addEventListener("click", async (e) => {


    e.preventDefault();
    let index = editbtn.getAttribute("data-index");
    let id = editbtn.getAttribute("data-id");
    console.log(index, id);

    const place = document.getElementById("place-" + index);
    const state = document.getElementById("state-" + index);
    const phoneNumber = document.getElementById("phone-" + index);
    const landMark = document.getElementById("landMark-" + index);
    const address = document.getElementById("address-" + index);
    const pincode = document.getElementById("pincode-" + index);
    const locality = document.getElementById("locality-" + index);
    const city = document.getElementById("city-" + index);

    const addressType = document
      .getElementById("addressType-" + index)
      .innerText.trim();
    const selectElement = document.getElementById("edit-adressType");

    // Loop through the options and select the one that matches `addressType`
    for (let option of selectElement.options) {
      if (option.value.toLowerCase() === addressType.toLowerCase()) {
        option.selected = true;
        break;
      }
    }

    edit_place_el.value = place.innerText;
    edit_state_el.value = state.innerText;
    edit_phone_el.value = phoneNumber.innerText;
    edit_landMark_el.value = landMark.innerText;
    edit_address_el.value = address.innerText;
    edit_pincode_el.value = pincode.innerText;
    edit_locality_el.value = locality.innerText;
    edit_city_el.value = city.innerText;
    addressId.value = id
    $("#editAddressModal").modal("show");
  });
});

save_EditAddress_Btn.addEventListener("click", async (e) => {
  const createErrElAfter = (element, err) => {
    if (element?.nextElementSibling?.id == "erro_el") {
      element.nextElementSibling.remove();
    }
    const new_el = document.createElement("p");
    new_el.setAttribute("id", "erro_el");
    new_el.style.color = "red";
    new_el.innerHTML = err;
    element.after(new_el);

    element.addEventListener('focus', () => {
      if (element.nextElementSibling?.id == "erro_el") {
        element.nextElementSibling.remove();
      }
    });

  };

  let isValid = true;

  if (edit_place_el?.value == "") {
    createErrElAfter(edit_place_el, "this field can not be empty");
    isValid = false;
  }

  if (edit_place_el?.value.length >= 50) {
    createErrElAfter(edit_place_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (edit_state_el?.value == "") {
    createErrElAfter(edit_state_el, "this field can not be empty");
    isValid = false;
  }

  if (edit_state_el?.value.length >= 20) {
    createErrElAfter(edit_state_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (edit_phone_el?.value == "") {
    createErrElAfter(edit_phone_el, "this field can not be empty");
    isValid = false;
  }

  if (edit_phone_el?.value.length >= 11) {
    createErrElAfter(edit_phone_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(edit_phone_el.value)) {
    createErrElAfter(edit_phone_el, "product name cannot be special char");
    isValid = false;
  }
  if (edit_landMark_el?.value == "") {
    createErrElAfter(edit_landMark_el, "this field can not be empty");
    isValid = false;
  }

  if (edit_landMark_el?.value.length >= 50) {
    createErrElAfter(edit_landMark_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (edit_address_el?.value == "") {
    createErrElAfter(edit_address_el, "this field can not be empty");
    isValid = false;
  }
  if (edit_pincode_el?.value.length >= 10) {
    createErrElAfter(edit_pincode_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (edit_pincode_el?.value == "") {
    createErrElAfter(edit_pincode_el, "this field can not be empty");
    isValid = false;
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(edit_pincode_el.value)) {
    createErrElAfter(edit_pincode_el, "this field cannot be special char");
    isValid = false;
  }
  if (edit_locality_el?.value.length >= 10) {
    createErrElAfter(edit_locality_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (/\d/.test(edit_locality_el.value)) {
    //d4 digit
    createErrElAfter(edit_locality_el, "this field cannot be numbers");
    isValid = false;
  }
  if (edit_locality_el?.value == "") {
    createErrElAfter(edit_locality_el, "this field can not be empty");
    isValid = false;
  }
  if (edit_city_el?.value.length >= 10) {
    createErrElAfter(edit_locality_el, "this field can not be longer than 20");
    isValid = false;
  }
  if (/\d/.test(edit_city_el.value)) {
    //d4 digit
    createErrElAfter(edit_city_el, "this field cannot be numbers");
    isValid = false;
  }
  if (edit_city_el?.value == "") {
    createErrElAfter(edit_city_el, "this field can not be empty");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const addressDetails = {
    place: edit_place_el.value,
    state: edit_state_el.value,
    phone: edit_phone_el.value,
    landmark: edit_landMark_el.value,
    address: edit_address_el.value,
    addressType: edit_address_type_el.value,
    pincode: edit_pincode_el.value,
    locality: edit_locality_el.value,
    city: edit_city_el.value,
    id: addressId.value
  };



  try {
    const response = await fetch("/edit-address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressDetails),
    });

    if (response.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "saved changes",
        showConfirmButton: false,
        timer: 1500,
      }).then(()=>{
        $("#addAddressModal").modal("hide");
        location.reload();
      })

    } else {
      alert("failed to save address");
    }
  } catch (error) {
    console.log(error);
  }
});


remove_btn_el.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    let id = e.target.closest(".address-items")?.getAttribute("data-id");
    

    console.log(id);
    

    if (!id) {  
      Swal.fire("Error", "Address ID not found!", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/delete-address/${id}`, {  
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            Swal.fire({
              title: "Successfully deleted address",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then(() => {
              removeAddressFromDOM(id);
            });
          } else {
            Swal.fire({
              title: "Something went wrong",
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          }
        } catch (error) {
          console.error("Fetch error:", error);
          Swal.fire("Error", "Failed to delete address", "error");
        }
      }
    });
  });
});

function removeAddressFromDOM(id) {
  const addressItem = document.querySelector(`.address-items[data-id="${id}"]`);
  console.log(addressItem);
  
  if (addressItem) {
    addressItem.remove();
    if (document.querySelectorAll(".address-items").length === 0) {
      document.querySelector("#address-container").innerHTML = `
        <div id="no-address-alert" class="alert alert-warning text-center" role="alert">
          No address found!
        </div>
      `;
    }
  }
}




