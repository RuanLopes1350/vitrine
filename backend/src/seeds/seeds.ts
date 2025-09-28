import 'dotenv/config';

import DbConnect from '../config/DbConnect.js';
import seedUsuarios from './seedUsuario.js';
import seedProdutos from './seedProduto.js';

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