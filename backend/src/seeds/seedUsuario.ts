import modelUsuario from '../models/modelUsuario'
import { typeUsuario } from '../types/typeUsuario'

import { getGlobalFakeMapping } from './globalFakeMapping'

async function seedUsuarios() {
    await modelUsuario.deleteMany();

    const usuarioFixo: typeUsuario = {
        nome: 'Ruan Lopes',
        email: 'intel.spec.lopes@gmail.com',
        senha: 'SenhaSuperSegur@123',
        whatsapp: '556992468120',
        ativo: true
    }

    await modelUsuario.collection.insertOne(usuarioFixo);
    console.log('Usuario pré-definido cadastrado com sucesso!')

    const mapping = await getGlobalFakeMapping();

    const usuariosAleatorios: typeUsuario[] = [];

    for (let i = 0; i < 24; i++) {
        usuariosAleatorios.push(
            {
                nome: mapping.usuario.nome(),
                email: mapping.usuario.email(),
                senha: mapping.usuario.senha(),
                whatsapp: mapping.usuario.whatsapp(),
                ativo: mapping.usuario.ativo()
            }
        )
    }

    await modelUsuario.collection.insertMany(usuariosAleatorios);
    console.log(`Seed de ${usuariosAleatorios.length} cadastrado com sucesso!`)
}

export default seedUsuarios;