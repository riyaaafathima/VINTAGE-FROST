
const productName_el = document.querySelector("#productName");
const category_el = document.querySelector("#category");
const preperationHour_el=document.querySelector('#preperation-hour')
const priceVariant_el = document.querySelector(".price-variant");
const description_el = document.querySelector("#description");
const cropbtn_el = document.querySelector("#crop-btn");
const savebtn_el = document.querySelector("#save-btn");
const img1_input = document.querySelector("#img-1");
const img2_input = document.querySelector("#img-2");
const img3_input = document.querySelector("#img-3");
const img_preview1 = document.querySelector("#img-1preview");
const img_preview2 = document.querySelector("#img-2preview");
const img_preview3 = document.querySelector("#img-3preview");
const addpriceBtn_el = document.querySelector("#add-pricebtn");
const addbtn_el = document.querySelector("#add-btn");
let priceCnt_el = document.querySelector(".price-variant");
const input_el = document.querySelectorAll("input");
const remove_btn_el = document.querySelector("#remove-btn");
const inputs = document.querySelectorAll("input");


let selectedImage = null;

let cropper = null;

let croppedImages = [];

let editedImage = {};

(async function () {
  editedImage = {
    [img_preview1.id]: "",
    [img_preview2.id]: "",
    [img_preview3.id]: "",
  };
})();

addbtn_el.addEventListener("click", async (e) => {
  e.preventDefault();

  let isValid = true;

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

  if (productName_el?.value == "") {
    createErrElAfter(productName_el, "product name can not be empty");
    isValid = false;
  }

  if (productName_el?.value.length >= 50) {
    createErrElAfter(productName_el, "product name can not be longer than 20");
    isValid = false;
  }
  if (category_el?.value == "") {
    createErrElAfter(category_el, "category feild cannot be empty");
    isValid = false;
  }

  if (preperationHour_el?.value == "") {
    createErrElAfter(preperationHour_el, "this field cannot be empty");
    isValid = false;
  }

  if (preperationHour_el?.value.length >= 20) {
    createErrElAfter(preperationHour_el, "product name can not be longer than 20");
    isValid = false;
  }

  if (description_el?.value == "") {
    createErrElAfter(description_el, " please add description");
    isValid = false;
  }

  if (img1_input?.value == "") {
    createErrElAfter(img1_input, "please Add image");
    isValid = false;
  }

  if (img2_input?.value == "") {
    createErrElAfter(img2_input, "please Add image");
    isValid = false;
  }

  if (img3_input?.value == "") {
    createErrElAfter(img3_input, "please add image");
    isValid = false;
  }

  if (/\d/.test(productName_el.value)) {
    //d4 digit
    createErrElAfter(productName_el, "product name cannot be numbers");
    isValid = false;
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(productName_el.value)) {
    createErrElAfter(productName_el, "product name cannot be special char");
    isValid = false;
  }
  if (/^\s*$/.test(productName_el.value)) {
    createErrElAfter(productName_el, "product name cannot be numbers");
    isValid = false;
  }
  if (/^\s*$/.test(description_el.value)) {
    createErrElAfter(description_el, "add description name ");
    isValid = false;
  }

  //arra input fe
  document.querySelectorAll(".weight-inputs").forEach((inputs, index) => {
    if (inputs?.value == "") {
      createErrElAfter(inputs, "please fill the field");
      isValid = false;
    }

    if (inputs?.value == "") {
      createErrElAfter(inputs, "please fill the field");
      isValid = false;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputs.value)) {
      createErrElAfter(inputs, " this field cannot be special char ");
      isValid = false;
    }
    if (/^\s*$/.test(inputs.value)) {
      createErrElAfter(inputs, "this field cannot be empty");
      isValid = false;
    }

    if (inputs?.value < 1) {
      createErrElAfter(inputs, "this field can't be less than 0");
      isValid = false;
    }
  });

  // price inputs validation

  document.querySelectorAll(".price-inputs").forEach((inputs) => {
    if (inputs?.value == "") {
      createErrElAfter(inputs, "please add a price");
      isValid = false;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputs.value)) {
      createErrElAfter(inputs, " this field cannot be special char ");
      isValid = false;
    }
    if (/^\s*$/.test(inputs.value)) {
      createErrElAfter(inputs, "this price field cannot be empty");
      isValid = false;
    }

    if (inputs?.value < 1) {
      createErrElAfter(inputs, "price can't be less than 0");
      isValid = false;
    }
  });
  document.querySelectorAll(".stock-inputs").forEach((inputs) => {
    if (inputs?.value == "") {
      createErrElAfter(inputs, "please add stock ");
      isValid = false;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputs.value)) {
      createErrElAfter(inputs, " this field cannot be special char ");
      isValid = false;
    }
    if (/^\s*$/.test(inputs.value)) {
      createErrElAfter(inputs, "this price field cannot be empty");
      isValid = false;
    }

    if (inputs?.value < 0) {
      createErrElAfter(inputs, "stock can't be less than 0");
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  let Varient = [];

  document.querySelectorAll(".price-inputs").forEach((price) => {
    Varient.push({ price: price.value });
  });
  document.querySelectorAll(".weight-inputs").forEach((weight, index) => {
    Varient[index].kg = weight.value;
  });
  document.querySelectorAll(".stock-inputs").forEach((stock, index) => {
    Varient[index].stock = stock.value;
  });
  console.log(Varient);

  const formData = new FormData();

  formData.append("productName", productName_el.value);
  formData.append("varients", JSON.stringify(Varient));
  formData.append("category", category_el.value);
  formData.append("description", description_el.value);
  formData.append("preperationHour", preperationHour_el.value);
  
  //   formData.append('croppedImages',croppedImages[0],'croppedImages.png');

  // for (let i = 0; i < croppedImages.length; i++) {
  //   if (croppedImages[0] instanceof Blob) {
  //     // Add file extension if it's a blob
  //     const fileExtension = croppedImages[0].type.split("/")[1];
  //     formData.append(
  //       "images",
  //       croppedImages[i],
  //       `${productName_el.value}${i + 1}.png`
  //     );
  //   }
  // }

  let i = 0;
  for (let key in editedImage) {
    formData.append(
      "images",
      editedImage[key],
      `${productName_el.value}${i + 1}.png`
    );

    i++;
  }

  const response = await fetch("/admin/add-product", {
    method: "POST",
    body: formData, // bcz we passing  blob in formdata so it not in json
  });

  if (response.ok) {
    console.log("ok");

    swal.fire("product added successfully").then(() => {
      window.location.href = "/admin/getAllproducts";
    });
  } else {
    const mssg = await response.json();
    console.log(mssg);

    swal.fire(mssg);
  }
});

img1_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  editedImage[img_preview1.id] = file;
  const imgUrl = URL.createObjectURL(file);
  img_preview1.src = imgUrl;

  img1_input.style.display = "none";
});
img2_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  editedImage[img_preview2.id] = file;

  const imgUrl = URL.createObjectURL(file);
  img_preview2.src = imgUrl;

  img2_input.style.display = "none";
});
img3_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  editedImage[img_preview3.id] = file;

  const imgUrl = URL.createObjectURL(file);

  img_preview3.src = imgUrl;

  img3_input.style.display = "none";
});

img_preview1.addEventListener("click", () => {
  if (selectedImage) {
    // if we click the img it has img so , making the selected img null for the currnt img
    selectedImage = null;
  }
  if (cropper) {
    cropper = null;
    cropper.destroy();
  }
  selectedImage = img_preview1;

  selectedImage.parentElement.style.border = "1px dashed green";
});
img_preview2.addEventListener("click", () => {
  if (selectedImage) {
    selectedImage.parentElement.style.border = "none"; // we want to remove the selected img border
    selectedImage = null;
  }

  if (cropper) {
    cropper = null;
    cropper.destroy();
  }

  selectedImage = img_preview2;

  selectedImage.parentElement.style.border = "1px dashed green";
});
img_preview3.addEventListener("click", () => {
  if (selectedImage) {
    selectedImage.parentElement.style.border = "none";

    selectedImage = null;
  }

  if (cropper) {
    cropper = null;
    cropper.destroy();
  }

  selectedImage = img_preview3;

  selectedImage.parentElement.style.border = "1px dashed green";
});

cropbtn_el.addEventListener("click", (e) => {
  if (!selectedImage) {
    //if selected image is not there crop btn diable
    return;
  }

  //     if (cropper) {
  //     cropper.destroy();
  //   }

  cropper = new Cropper(selectedImage, {
    aspectRatio: 1,
    viewMode: 1,
    preview: ".preview",
  });
});

savebtn_el.addEventListener("click", (e) => {
  if (!selectedImage || !cropper) {
    return;
  }

  const canvas = cropper.getCroppedCanvas(); // we can add any element in  canvas
  canvas.toBlob((blob) => {
    //blob is a file type
    console.log(blob);

    const blobUrl = URL.createObjectURL(blob); // we transform into image form

    selectedImage.src = blobUrl; // and we put the blobed image into selectredimage

    editedImage[selectedImage.id] = blob;

    croppedImages.push(blob);

    cropper.destroy();
    cropper = null;

    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000); // remove the url that created for obj
  });
});

addpriceBtn_el.addEventListener("click", (e) => {
  console.log('wertyuiop');
  
  const veriant_el = document.querySelector(".price-variant"); // Select the original price-variant div
  const priceCnt_el = document.querySelector("#price-cnt"); // Parent container

  // Clone the original price-variant div
  const new_input = veriant_el.cloneNode(true);

  // Generate unique IDs for the cloned inputs
  const uniqueId = Date.now(); // Use timestamp to ensure uniqueness
  new_input
    .querySelector('input[id="Weight"]')
    .setAttribute("id", `Weight-${uniqueId}`);
  new_input
    .querySelector('input[id="price"]')
    .setAttribute("id", `price-${uniqueId}`);

  // Clear input values for the cloned inputs
  new_input.querySelector('input[id^="Weight"]').value = "";
  new_input.querySelector('input[id^="price"]').value = "";

  // Add a remove button to the cloned input
  const removeBtn = new_input.querySelector("#remove-btn");
  removeBtn.addEventListener("click", () => {
    // Clear the input values of the parent before removing
    new_input.querySelector('input[id^="Weight"]').value = "";
    new_input.querySelector('input[id^="price"]').value = "";
    // Remove the cloned div
    new_input.remove();
  });

  // Append the new input to the parent container
  priceCnt_el.appendChild(new_input);


  const weight_input = new_input.querySelector(`#Weight-${uniqueId}`);
  weight_input.addEventListener("focus", (e) => {
    if (weight_input?.nextElementSibling?.id == "erro_el") {
      weight_input.nextElementSibling.remove();
    }
  });
  const price_input = new_input.querySelector(`#price-${uniqueId}`);
  price_input.addEventListener("focus", (e) => {
    if (price_input?.nextElementSibling?.id == "erro_el") {
      price_input.nextElementSibling.remove();
    }
  });
});

inputs.forEach((input) => {
  input.addEventListener("focus", (e) => {
    if (input?.nextElementSibling?.id == "erro_el") {
      input.nextElementSibling.remove();
    }
  });
});


description_el.addEventListener('focus',(e)=>{
  
    if (description_el?.nextElementSibling?.id == "erro_el") {
      description_el.nextElementSibling.remove();
    }
})




