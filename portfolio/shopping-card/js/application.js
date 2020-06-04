//Convert a nuber to currency USD format. Found in https://flaviocopes.com/how-to-format-number-as-currency-javascript/
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
//-----------------------------------------------------------

class shoppingCardItens {
    constructor (name, unityPrice, qty) {
        this.name = name;
        this.unityPrice = unityPrice;
        this.qty = qty;
    }

    totalItem() {
        return this.unityPrice * this.qty
    }

    lineTable() {
        return `<tr>
                <th>${this.name}</th>
                <td class='unity-price-item'>${this.unityPrice}</td>
                <td><span>QTY</span><input class="input-qty" type='number' value='${this.qty}'></input></td>
                <td><button class="delete-item">Cancel</button></td>
                <td class='total-item-USD'>${formatter.format( this.totalItem() ) }</td>
                <td class='total-item' style='display:none;'>${this.totalItem()}</td>
                </tr>`
                //The <td class='total-item'> is never exibit on screen, but is used to calculate the total Price in updatingTotalValue()
            }

    includeToMainTable() {
        $('#main-table').append( this.lineTable() );
    }
}

let updatingTotalValue = function() {
    let sum = 0;
    $('.total-item').each( function(){
        sum += Number( $(this).text() );
    })

    $('#total-price').text( formatter.format(sum) );
}

let itensDefault = [new shoppingCardItens("Salmon" , 60 , 2),
                    new shoppingCardItens("Tuna" , 50, 3),
                    new shoppingCardItens("Carp" , 40, 2),
                    new shoppingCardItens("Pork" , 50, 2),
                    new shoppingCardItens("Beef" , 40, 4) ];

let loadDefaultData = function() {
    itensDefault.forEach( function(itemDefault) { 
       itemDefault.includeToMainTable( itemDefault.lineTable() );
    })

    updatingTotalValue();
}

let includeItem = function (event) {
    event.preventDefault();
    let newName = $(this).children('[name = name-item]').val();
    let newUnitaryPice = $(this).children('[name = unity-price]').val();
    let newQty = $(this).children('[name = qty]').val();
    let myNewItem = new shoppingCardItens(newName, newUnitaryPice, newQty);
    myNewItem.includeToMainTable( myNewItem.lineTable() );
    updatingTotalValue();
}

var timeOut;
let updateQty = function() {
    clearTimeout(timeOut);
    
    let currentRow = $(this).closest('tr'); //Have to be here (and not inside the function of setTimeout) to grab the THIS value

    timeOut = setTimeout( function() {        
        let qty = currentRow.find('.input-qty');
        if(qty.val() < 0) {
            qty.val(0);
        }
        let unitaryPrice = currentRow.children('.unity-price-item').text()
        let newTotalItem = unitaryPrice * qty.val();
        currentRow.children('.total-item').text(newTotalItem);       
        currentRow.children('.total-item-USD').text(formatter.format(newTotalItem));  
        updatingTotalValue();
    } , 500);   
}

let deleteItem = function () {
    $(this).closest('tr').remove();
    updatingTotalValue();
}

//------------------MAIN-----------------------
$(document).ready( function(){
    loadDefaultData();
    $('#add-item').on('submit' , includeItem);
    $(document).on('input', '.input-qty', updateQty);
    $(document).on('click' , '.delete-item' , deleteItem);
});

