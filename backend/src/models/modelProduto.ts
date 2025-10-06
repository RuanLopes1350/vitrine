import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';

class Produto {
    model: mongoose.Model<any>;

    constructor() {
        const schema = new mongoose.Schema(
            {
                criador: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios' },
                nome_produto: {type: String, required: true},
                descricao: {type: String, required: true},
                preco: {type: Number, required: true},
                imagem: {type: String, required: false},
                ativo: {type: Boolean, default: true}
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
        this.model = mongoose.model("produtos", schema);
    }
}

export default new Produto().model;