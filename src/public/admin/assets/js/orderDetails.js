const status_btn_el=document.querySelectorAll('.status-change-btn')
const instruction_el = document.querySelectorAll("#instruction-Btn");
const mssg_el = document.querySelectorAll("#mssg-btn");


status_btn_el.forEach((btn)=>{
    btn.addEventListener('click',async(e)=>{
        e.preventDefault()
        const orderId = btn.getAttribute('order-id');
      const productId = btn.getAttribute('product-id');
      const status = btn.getAttribute('data-status');



      try {
        const response=await fetch(`/admin/update-status/${orderId}/${productId}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({status})
        })
       if(response.ok){
        alert('stattus updated')
        window.location.reload()

       }else{
        alert('somethimg wrong')
       }
  
      } catch (error) {
        console.log(error);
        
      }
    })
})


const modal = document.getElementById("myModal");
const modalTitle = document.getElementById("modalTitle");
const textarea = document.getElementById("modalTextarea");

function openModal(type) {
  modal.style.display = "block";
  modalTitle.textContent =
    type === "instruction" ? "View Instruction" : "View Message";
}

function closeModal() {
  modal.style.display = "none";
}

function saveChanges() {
  console.log("Saving:", textarea.value);
  closeModal();
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target === modal) {
    closeModal();
  }
};

instruction_el.forEach((el) => {
  el.addEventListener("click", (e) => {

    // const row = e.target.closest("tr");
   
    // const kg = row.querySelector(".kg-col").textContent.trim();
    
    // const productId = row.querySelector(".btn-remove").getAttribute("data-id");

    // console.log(kg,productId);
    textarea.setAttribute("data-type", "instruction");
    // textarea.setAttribute("data-kg", kg);
    // textarea.setAttribute("data-productId", productId);
    textarea.innerHTML = el.getAttribute("data-instruction");


    openModal("instruction");
  });
});

mssg_el.forEach((el) => {
  el.addEventListener("click", (e) => {

    // const row = e.target.closest("tr");
   
    // const kg = row.querySelector(".kg-col").textContent.trim();
    
    // const productId = row.querySelector(".btn-remove").getAttribute("data-id");


    // textarea.setAttribute("data-kg", kg);
    // textarea.setAttribute("data-productId", productId);
    textarea.setAttribute("data-type", "message");
    textarea.innerHTML = el.getAttribute("data-mssg");
    openModal("message");
  });
});