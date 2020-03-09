const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const Categorias = new Schema ({
    nome: {
        type: String,
        required: true,
        default: "Um nome padrão"
    },
    slug:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categorias)