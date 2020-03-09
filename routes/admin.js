const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categorias")
const Categorias= mongoose.model("categorias")
require('../models/Postagen')
const Postagen = mongoose.model("postagen")
const{eAdmin} = require("../helpers/eAdmin")



router.get('/',  eAdmin,(req, res) =>{
    res.render("admin/index")

})

router.get('/posts', eAdmin,(req, res) => {
    res.send("Página de Posts")
})

router.get("/categorias", eAdmin,(req, res)=>{
    Categorias.find().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})        
    }).catch((err)=>{
        req.flash("error_msg", "houve erro ao listar as categorias")
        res.redirect("/admin")
    })
        
})

router.get('/categorias/add', eAdmin,(req, res)=>{
    res.render("admin/addcategorias")
})


router.post("/categorias/nova", eAdmin,(req, res) => {
 var erros =[]
 if(!req.body.name && typeof req.body.nome == undefined || req.body.nome == null) {
     error.push({text: "Nome invalido"})

 }
 if(!req.body.slug || typeof req.body.slug ==undefined || req.body.slug ==null){
     erros.push({texto: "Slug invalido"})
 }
 if(req.body.nome.length < 2){
     erros.push({texto: "Nome da categoria e muito pequeno"})
 }
 if(erros.length > 0 ){
     res.render("admin/addcategorias", {erros: erros})
 }else{
 const novaCategorias = {
    nome: req.body.nome,
    slug: req.body.slug
}

new Categorias(novaCategorias).save().then(() => {
    req.flash("success_msg", "Categoria criada com successo!")
   res.redirect("/admin/categorias")
}).catch((err) => {
    req.flash("error_msg","Houve erro ao salvar tente novamente!")
  res.redirect("/admin")
   })
}
})

router.get("/categorias/edit/:id", eAdmin,(req, res) => {
    Categorias.findOne({_id: req.params.id}).then((categorias) => {
        res.render("admin/editcategorias", {categorias: categorias})
    }).catch((err)=> {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
 
})

router.post("/categorias/edit", eAdmin, eAdmin,(req,res) => {
    Categorias.findOne({_id: req.body.id}).then((categorias)=>{
        categorias.nome =req.body.nome
        categorias.slug = req.body.slug

        categorias.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "houve um erro")
            res.redirect("/admin/categorias")
        })

    }).catch((err)=>{
        req.flash("erro_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categorias.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categorias deletada!")
        res.rediecct("/admin/categorias")

    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao deletar")
        res.redirect("/admin/categorias")
   })
})

router.get("/postagen", eAdmin, (req, res) => {
    Postagen.find().populate("categorias").sort({data:"desc"}).then((postagen)=>{
        res.render("admin/postagen", {postagen: postagen})
    }).catch((err)=> {
        req.flash("error_msg", "erro ao listar postagens")
        res.redirect("/admin")
    })
   
})

router.get("/postagen/add", eAdmin,(req , res) => {
    Categorias.find().then((categorias) =>{
        res.render("admin/addpostagen", {categorias: categorias})

    }).catch((err) =>{
        req.flash("error_msg", "houve erro ao carregar formulario")
        res.redirect("/admin")
    })
  

})

router.post("/postagen/nova",  eAdmin,(req, res) => {
    var erros= []

    if(req.body.categorias == "0") {
        erros.push({texto: "Categoria invalida, registre uma categoria"})
    }
    if(erros.length > 0) {
      
      res.render("admin/addcategorias", {erros: erros})
      Categorias.find() 
      .then(categorias => {
          res.render('admin/addpostagen',{erros: erros, categorias: categorias})
      })
      }else{
        const novaPostagen = {
            titulo: req.body.titulo,
            conteudo: req.body.conteudo,
            categorias: req.body.categorias,
            slug: req.body.slug,
            descricao: req.body.descricao,

        }
        new Postagen(novaPostagen).save().then(() => {
            Categorias.find() 
            req.flash("success_msg", "postagem criada com sucesso!")
            res.redirect("/admin/postagen")
        }).catch((err)=>{
            console.log(err)
           req.flash("error_msg", "Houve erro durante salvamento de postagen")
            res.redirect("/admin/postagen")
        })


      }
           
})

router.get("/postagen/edit/:id", eAdmin,(req, res) =>{
    Postagen.findOne({_id: req.params.id}).then((postagen)=>{
        Categorias.find().then((categorias)=>{
            res.render("admin/editpostagens", {categorias: categorias, postagen:postagen})

        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao listar as categorias!")
            res.redirect("/admin/postagen")
        })

    }).catch((err)=>{
        req.flash("error_msg", "houve erro ao editar")
        res.redirect("/admin/postagen")
    })
   
})

router.post("/postagen/edit", eAdmin,(req, res)=>{
    Postagen.findOne({_id: req.body.id}).then((postagen)=>{
        postagen.titulo = req.body.titulo,
        postagen.slug = req.body.slug,
        postagen.descricao = req.body.descricao,
        postagen.categorias = req.body.categorias

        postagen.save().then(()=>{
            req.flash("success_msg", "postagem editada com sucesso")
            res.redirect("/admin/postagen")
        }).catch((err)=> {
            console.log(err)
            req.flash("error_msg", "Erro interno")
            res.redirect("/admin/postagen")
        })




    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao salvar a edição")
        res.redirect("/admin/postagen")
    })



})
router.get("/postagen/deletar/:id", eAdmin,(req, res)=>{
    Postagen.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagen")
    }).catch((err)=>{
        req.flash("error_msg", "houve um erro interno")
        res.redirect("admin/postagen")
    
    })
})

module.exports = router