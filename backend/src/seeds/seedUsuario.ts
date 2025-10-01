import modelUsuario from '../models/modelUsuario.js'
import { typeUsuario } from '../types/typeUsuario.js'

import { getGlobalFakeMapping } from './globalFakeMapping.js'

async function seedUsuarios() {
    await modelUsuario.deleteMany();

    const usuarioFixo: typeUsuario[] = [{
        nome: 'Ruan Lopes',
        nomeLoja: 'Millennium',
        email: 'intel.spec.lopes@gmail.com',
        senha: 'SenhaSuperSegur@123',
        whatsapp: '556992468120',
        ativo: true
    },{
        nome: 'Silvio Huan',
        nomeLoja: 'Millennium',
        email: 'silvio.huan@gmail.com',
        senha: 'SenhaSuperSegur@123',
        whatsapp: '55695566778',
        ativo: true
    },{
        nome: 'Luis Felipe',
        nomeLoja: 'Millennium',
        email: 'luis.felipe@gmail.com',
        senha: 'SenhaSuperSegur@123',
        whatsapp: '556911223344',
        ativo: true
    }
]

    await modelUsuario.collection.insertMany(usuarioFixo);
    console.log('Usuario pré-definido cadastrado com sucesso!')

    const mapping = await getGlobalFakeMapping();

    const usuariosAleatorios: typeUsuario[] = [];

    for (let i = 0; i < 27; i++) {
        usuariosAleatorios.push(
            {
                nome: mapping.usuario.nome(),
                nomeLoja: mapping.usuario.nomeLoja(),
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