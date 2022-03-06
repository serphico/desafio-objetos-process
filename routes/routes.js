const {Router} = require('express');
const passport = require('passport');
const prodGen = require('../controllers/prodGen.js')
const isAuth = require('../util/isAuth.js')
const path = require('path')
const {fork} = require('child_process');
const { render } = require('pug');
const appRoute = Router();
const chatRoute = Router();
const loginRoute = Router();
const registerRoute = Router();
const logoutRoute = Router();
const infoRoute = Router();
const randomRoute = Router();
const failLoginRoute = Router();
const failRegisterRoute = Router();

chatRoute.get('/', isAuth,(req,res) => {

    res.render('./layouts/index.pug')
})

appRoute.get('/', isAuth,(req, res) => {
        let products = prodGen();
        let user = req.session.email
        res.render('./layouts/productos.pug',{products,user})
})

appRoute.post('/', (req, res) => {
    let user = req.session.email

    req.session.destroy( err =>{
        if(err){
            console.log(err)
        }else{
                res.render('./layouts/byeUser.pug',{user})
        }
    })

})


registerRoute.get('/', (req,res) => {

    res.render('./layouts/registro.pug')
})

registerRoute.post('/', passport.authenticate('registro',{failureRedirect: '/failregistro', successRedirect: '/login'}))

loginRoute.get('/', (req,res) => {

    res.render('./layouts/login.pug')
})

loginRoute.post('/', passport.authenticate('login',{failureRedirect: '/faillogin'}),(req, res)=>{
    req.session.email = req.body.username

    res.redirect('/api/productos-test')
})

logoutRoute.get('/', (req, res) => {
    req.logOut();
    res.redirect('/login')
})

failLoginRoute.get('/',(req, res)=>{
    res.render('./layouts/loginfail.pug')
})

failRegisterRoute.get('/',(req, res)=>{
    res.render('./layouts/registrofail.pug')
})

infoRoute.get('/', isAuth,(req,res) =>{

    let infoSys ={
        Argumentos: process.argv,
        Procesador: process.platform,
        VersionNode: process.version,
        Memoria: JSON.stringify(process.memoryUsage()),
        DireccionEjecucion: process.execPath,
        ProcessId: process.pid,
        DireccionProyecto: process.cwd(),
    }
    res.render('./layouts/info.pug',{infoSys})
})

randomRoute.get('/',(req ,res) =>{
    res.render('./layouts/random.pug')
})
randomRoute.get('/envio', (req,res) =>{

        const forked = fork(path.resolve(__dirname, '../randomNum.js'))
        forked.on('message', msg => {
            if (msg == 'listo') {
                    if(!req.query.cant){
                        let cant = 10000000

                        forked.send(`${cant}`)
                    }else{
                        let cant = req.query.cant

                        forked.send(`${cant}`)

                    }
    
            } else {
                console.log(`resultado: ${msg}`)

                    res.render('./layouts/random.pug', {msg})
                
            }
         })
         
    



})

module.exports = {appRoute,chatRoute,loginRoute,registerRoute,logoutRoute, failLoginRoute, failRegisterRoute,infoRoute, randomRoute};