const productName_el = document.querySelector("#productName");
const category_el = document.querySelector("#category");
const stock_el = document.querySelector("#stock");
const quantity_el = document.querySelector("#quantity");
const priceVariant_el = document.querySelector(".price-variant");
const weight_el = document.querySelector("#Weight");
const price_el = document.querySelector("#price");
const description_el = document.querySelector("#description");
const removeBtn_el = document.querySelector("#remove-btn");
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



let selectedImage = null;

let cropper = null;

let croppedImages=[]


// console.log(
//     productName_el,
//     category_el,
//     status_el,
//     stock_el,
//     priceVariant_el,
//   weight_el
//     price_el,
//     removeBtn_el,
//     addpriceBtn_el,
//     addbtn_el
// );

addbtn_el.addEventListener("click", async(e) => {
  e.preventDefault();

  let isValid=true

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


  if(productName_el?.value == ""){
    createErrElAfter(productName_el,"product name can not be empty")
   isValid=false
 }
 
 if(productName_el?.value.length >= 20){
   createErrElAfter(productName_el,"product name can not be longer than 20")
   
 }
  if(category_el?.value == ""){
    createErrElAfter(category_el,"product name can not be empty")
    
 }
 
 
  if(stock_el?.value == ""){
    createErrElAfter(stock_el,"product name can not be empty")
    
 }
 
 if(stock_el?.value.length >= 20){
   createErrElAfter(stock_el,"product name can not be longer than 20")
  
 }
  if(quantity_el?.value == ""){
    createErrElAfter(quantity_el,"add quantity")
   
 }
 
 if(quantity_el?.value.length >= 20){
   createErrElAfter(quantity_el,"product name can not be longer than 20")
   
 }
  if(weight_el?.value == ""){
    createErrElAfter(weight_el,"product name can not be empty")
    
 }
 
 
  if(price_el?.value == ""){
    createErrElAfter(price_el,"product name can not be empty")
  
 }
 

  if(description_el?.value == ""){
    createErrElAfter(description_el,"add description")
   
 }
 

  if(img1_input?.value == ""){
    createErrElAfter(img1_input,"Add image")
    
 }
 

  if(img2_input?.value == ""){
    createErrElAfter(img2_input,"Add image")
    
 }
 

  if(img3_input?.value == ""){
    createErrElAfter(img3_input,"add image")
    
 }
 
 if(weight_el?.value.length >= 20){
   createErrElAfter(weight_el,"Add weight")
  
 }



const formData = new FormData();

  formData.append("productName", productName_el.value);
  formData.append("price", JSON.stringify([{ kg: weight_el.value, price: price_el.value }]));
  formData.append("stock", stock_el.value);
  formData.append("category", category_el.value);
  formData.append("description", description_el.value);
  formData.append('quantity',quantity_el.value);
//   formData.append('croppedImages',croppedImages[0],'croppedImages.png');  

for (let i = 0; i < croppedImages.length; i++) {
  if (croppedImages[0] instanceof Blob) {
    // Add file extension if it's a blob
    const fileExtension = croppedImages[0].type.split('/')[1];
    formData.append('images', croppedImages[i],`${productName_el.value}${i+1}.png`);
    }

}
  const response= await fetch('/admin/add-product',{
    method:'POST',
    // headers:{
    //     'Content-Type':'application/json'
    // },
    body:formData

})
});

img1_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);
  img_preview1.src = imgUrl;

 
  img1_input.style.display = "none";
});
img2_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);
  img_preview2.src = imgUrl;

  img2_input.style.display = "none";
});
img3_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);

  img_preview3.src = imgUrl;

  img3_input.style.display = "none";
});

img_preview1.addEventListener("click", () => {
  if (selectedImage) {
    selectedImage = null;
  }
  if (cropper) {
    cropper=null
    cropper.destroy()
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
    cropper=null
    cropper.destroy()
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
    cropper=null
    cropper.destroy()
  }

  selectedImage = img_preview3;

  selectedImage.parentElement.style.border = "1px dashed green";
});

cropbtn_el.addEventListener("click", (e) => {
    if (!selectedImage) {
                                  //if selected image is not there crop btn diable
        return 
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

savebtn_el.addEventListener('click',(e)=>{

  if (!selectedImage||!cropper) {
    return
    
  }
     
  const canvas = cropper.getCroppedCanvas();    // we can add any element in  canvas   
  canvas.toBlob((blob) => {  //blob is a file type 
    console.log(blob);  
  
    const blobUrl = URL.createObjectURL(blob);   // we transform into image form

   
           selectedImage.src = blobUrl;  // and we put the blobed image into selectredimage

           croppedImages.push(blob)

    
    cropper.destroy();
    cropper = null;

    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);   // remove the url that created for obj
  });

})