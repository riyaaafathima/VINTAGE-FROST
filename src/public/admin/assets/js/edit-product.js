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
const productId=document.getElementById('_id')

const addpriceBtn_el = document.querySelector("#add-pricebtn");
const addbtn_el = document.querySelector("#add-btn");


console.log(addbtn_el,'asdfghjk');


let selectedImage = null;

let cropper = null;

let croppedImages=[]

let editedImage={};


(async function () {
   const [image1Blob,image2Blob,image3Blob] = await Promise.all([
        getImageFile(img_preview1.src),
        getImageFile(img_preview2.src),
        getImageFile(img_preview3.src)])

        editedImage={
            img_preview1:image1Blob,
            img_preview2:image2Blob,
            img_preview3:image3Blob
        }
})()



async function getImageFile(imgUrl) {
  
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    
  
    await new Promise(resolve => img.onload = resolve);
    
  
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    
   
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    return new File([blob], 'cropped-image.png', { 
        type: 'image/png', 
        lastModified: Date.now() 
    });
  }


console.log(
    productName_el,'dfghjkl'
  //   category_el,
  //   status_el,
  //   stock_el,
  //   priceVariant_el,
  // weight_el
  //   price_el,
  //   removeBtn_el,
  //   addpriceBtn_el,
  //   addbtn_el
);



addbtn_el.addEventListener("click", async(e) => {
  e.preventDefault();

//   const productDetails = {
//     productName: productName_el.value,
//     price: [
//       {
//         kg: weight_el.value,

//         price: price_el.value,
//       },
//     ],
//     stock: stock_el.value,

//     category: category_el.value,

//     description: description_el.value,
//   };
//   console.log(productDetails);

const formData = new FormData();

  formData.append("productName", productName_el.value);
  formData.append("price", JSON.stringify([{ kg: weight_el.value, price: price_el.value }]));
  formData.append("stock", stock_el.value);
  formData.append("category", category_el.value);
  formData.append("description", description_el.value);
  formData.append('quantity',quantity_el.value);
//   formData.append('croppedImages',croppedImages[0],'croppedImages.png');  

// for (let i = 0; i < croppedImages.length; i++) {
//   if (croppedImages[0] instanceof Blob) {
//     // Add file extension if it's a blob
//     const fileExtension = croppedImages[0].type.split('/')[1];
//     formData.append('images', croppedImages[i],`${productName_el.value}${i+1}.png`);
//     }

  
// }
let i=0
for(let key in editedImage ){

    formData.append('images', editedImage[key],`${productName_el.value}${i+1}.png`);

    i++
}

  const response= await fetch(`/admin/edit-product/${productId.value}`,{
    method:'PUT',
    // headers:{
    //     'Content-Type':'application/json'
    // },
    body:formData

})
});

console.log('hi ia riya');




img1_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);
  img_preview1.src = imgUrl;
  
  img1_input.style.display = "none";
});
img2_input.addEventListener("change", (e) => {
    const file = event.target.files[0];
    const imgUrl = URL.createObjectURL(file);
    console.log('this is input2');
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

           editedImage[selectedImage]=blob



    
    cropper.destroy();
    cropper = null;

    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);   // remove the url that created for obj
  });

})