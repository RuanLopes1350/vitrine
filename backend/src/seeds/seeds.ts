import 'dotenv/config';
import mongoose from 'mongoose';

import DbConnect from '../config/DbConnect';
import seedUsuarios from './seedUsuario';
import seedProdutos from './seedProduto';

await DbConnect.conectar()

async function main () {
    try {
        const usuarios:any = await seedUsuarios();
        await seedProdutos(usuarios)
        console.log('SEED FINALIZADO SEM ERROS!')
    } catch (erro) {
        console.error('Erro ao executar seed:', erro)
    } finally {
        DbConnect.desconectar();
        process.exit(0);
    }
}

main();