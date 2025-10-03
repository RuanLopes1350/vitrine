import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

class Usuario {
    model: mongoose.Model<any>;
    
    constructor() {
        const schema = new mongoose.Schema(
            {
                nome: { type: String, required: true },
                nomeLoja: { type: String, required: true },
                email: { type: String, required: true, unique: true },
                senha: { type: String, required: true, select: false },
                whatsapp: { type: String, required: true },
                ativo: { type: Boolean, default: false },
                fotoPerfil: {type: String, required: false},
                mensagem: {type: String, required: false},
                accessToken:{type: String, required: false, select: false}
            },
            {
                timestamps: {
                    createdAt: "data_cadastro",
                    updatedAt: "data_ultima_atualizacao",
                },
                versionKey: false,
            }
        );

        schema.plugin(mongoosePaginate);
        this.model = mongoose.model("usuarios", schema);
    }
}

export default new Usuario().model;