import modelProduto from '../models/modelProduto.js'
import modelUsuario from '../models/modelUsuario.js';
import { typeProduto } from '../types/typeProduto.js'
import { typeUsuario } from '../types/typeUsuario.js';

import { getGlobalFakeMapping } from './globalFakeMapping.js'

async function seedProdutos(usuarios: typeUsuario[]) {
    await modelProduto.collection.deleteMany();

    const usuarioFixo = await modelUsuario.findOne({ email: 'intel.spec.lopes@gmail.com' });
    if (!usuarioFixo) {
        throw new Error("Usuário fixo com email 'intel.spec.lopes@gmail.com' não encontrado.");
    }

    const mapping = await getGlobalFakeMapping();

    let quantidade: number = 15;

    for(let criados: number = 0; criados < quantidade; criados++){
        const produtoAleatorio: typeProduto = {
            criador: usuarioFixo._id,
            nome_produto: mapping.produto.nome_produto(),
            descricao: mapping.produto.descricao(),
            mensagem: mapping.produto.mensagem(),
            imagem: mapping.produto.imagem(),
            preco: Number(mapping.produto.preco()),
            ativo: mapping.produto.ativo(),
        };
        await modelProduto.collection.insertOne(produtoAleatorio);
    }

    const produtoFixo: typeProduto = {
        criador: usuarioFixo._id,
        nome_produto: 'Produto de Teste',
        descricao: 'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        mensagem: `Olá, me interessei pelo produto X...`,
        imagem: 'https://cdn.pixabay.com/photo/2021/05/25/21/29/pampas-grass-6283622_960_720.jpg',
        preco: 123.45,
        ativo: true
    }

    await modelProduto.collection.insertOne(produtoFixo);
    console.log('Produto pré-definido cadastrado com sucesso!')

    const produtosAleatorios: typeProduto[] = [];

    for (let i = 0; i < 27; i++) {
        produtosAleatorios.push(
            {
                criador: mapping.produto.criador(),
                nome_produto: mapping.produto.nome_produto(),
                descricao: mapping.produto.descricao(),
                mensagem: mapping.produto.mensagem(),
                imagem: mapping.produto.imagem(),
                preco: Number(mapping.produto.preco()),
                ativo: mapping.produto.ativo(),
            }
        )
    }

    await modelProduto.collection.insertMany(produtosAleatorios);
    console.log(`Seed de ${produtosAleatorios.length} cadastrado com sucesso!`)
}

export default seedProdutos;