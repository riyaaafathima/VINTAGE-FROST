const categoryName_el = document.querySelector('#name')
const status_el = document.querySelector('#status')
const createbtn_el = document.querySelector('.create-btn')


console.log(createbtn_el)



createbtn_el.addEventListener('click',async(e)=>{
    e.preventDefault()

    const categoryDetails={
        categoryName:categoryName_el.value,
        isActive:status_el.value
    }

    const response = await fetch('/admin/add-category',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(categoryDetails)
    })
})


