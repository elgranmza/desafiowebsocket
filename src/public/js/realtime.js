const socket = io();

const itemDescription = document.getElementById('itemDescription');
const createItemButton = document.getElementById('createItemButton');
const tbodyId = document.getElementById("tbodyId")


createItemButton.addEventListener('click',()=>{
    socket.emit('new item',{description: itemDescription.value })
    itemDescription.value = ""
})

//socket server events:
socket.on('list updated',({items})=>{
    tbodyId.innerHTML = ""
    items.forEach(item => {
        tbodyId.innerHTML+=`<tr>
            <td>${item.id}</td>
            <td>${item.description}</td>
            <td><button onclick="deleteItem(${item.id})">delete</button></td>
        </tr>`
    });
})


function deleteItem(id){
    socket.emit('delete item',{id: id})
}