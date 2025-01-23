const price_el = document.querySelector('.product-price');
const kg_el = document.querySelector('#kg');
const stock_el=document.querySelector('#stock')
kg_el.addEventListener('change', (e) => {
    
    const selectedOption = e.target.options[e.target.selectedIndex];
    console.log(selectedOption);
    
    const newPrice = selectedOption.getAttribute('data-price');
    const  newstock = selectedOption.getAttribute('data-stock');
    if (newstock==0) {
        stock_el.innerHTML='Out of stock'
        
    }else if(newstock<=10){

        stock_el.innerHTML='Limited stock'

    }else{
        stock_el.innerHTML='In stock'
        
    }
    
    if (price_el && newPrice) {
        price_el.textContent = newPrice;
    }
});