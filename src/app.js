const express = require('express');
const port = 8080;
const itemsRouter = require('./routes/items.router')
const viewsRouter = require('./routes/views.router')
const collectionsRouter = require('./routes/collection.router');
const handlebars = require('express-handlebars');
const {Server} = require('socket.io');
const ItemsManager = require('./ItemsManager');

const manager = new ItemsManager(__dirname+'/files/items.json')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//handlebars config
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

//public files
app.use(express.static(`${__dirname}/public`))


const serverHttp = app.listen(port, ()=>console.log(`Server running on port ${port}`));



//socket.io
const io = new Server(serverHttp)

app.use((req, res, next)=>{
    req.io = io; 
    next();
})

io.on('connection',(socket)=>{
    console.log('socket connected')

    socket.on('new item',async (newItem)=>{
        await manager.addItem(newItem)
        const items = await manager.getItems();
        io.emit('list updated', {items:items})
    })

    socket.on('delete item',async ({id})=>{
        await manager.deleteItem(id)
        const items = await manager.getItems();
        io.emit('list updated', {items:items})
    })
})


//routes
app.use('/api/items', itemsRouter);
app.use('/api/collections', collectionsRouter);
app.use('/', viewsRouter)

