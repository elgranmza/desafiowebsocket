const fs = require('fs');

class ItemsManager {
    static id = 0; 

    constructor(path){
        this.path = path; 
        
        fs.writeFileSync(path, '[]')
        
    }

    async addItem(item){
        
        const content = await  fs.promises.readFile(this.path, 'utf-8'); 
        const items = JSON.parse(content); 

        item.id = ++ItemsManager.id; 

        items.push(item); 
        await fs.promises.writeFile(this.path, JSON.stringify(items,null, '\t')); 
    }

    async getItems(){
        const content = await  fs.promises.readFile(this.path, 'utf-8'); 
        const items = JSON.parse(content); 

        return items; 
    }

    async getItem(id){
        const content = await  fs.promises.readFile(this.path, 'utf-8'); 
        const items = JSON.parse(content); 

        const item = items.find(i=>i.id == id)

        return item; 
    }

    async updateItem(id, newItem){
        let items = await this.getItems();
        let index = items.findIndex(i=>i.id == id) 

        items[index] = {...newItem, id: items[index].id }; 
        
        await fs.promises.writeFile(this.path, JSON.stringify(items,null, '\t')); 
    }

    async deleteItem(id){
        const content = await  fs.promises.readFile(this.path, 'utf-8'); 
        let items = JSON.parse(content); 

        items = items.filter(i=>i.id != id) 

        await fs.promises.writeFile(this.path, JSON.stringify(items,null, '\t')); 
    }
}

module.exports = ItemsManager; 