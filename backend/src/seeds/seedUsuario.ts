import modelUsuario from '../models/modelUsuario.js'
import { typeUsuario } from '../types/typeUsuario.js'

import getGlobalFakeMapping from './globalFakeMapping.js'

async function seedUsuarios() {
    await modelUsuario.deleteMany();

    let senhaPadrao = 'SenhaSuperSegur@123';

    // Hash da senha padrão
    const hashedPassword = await import('../utils/helpers/passwordHelper.js').then(module => 
        module.PasswordHelper.hash(senhaPadrao)
    );

    // Usuários fixos para garantir acesso inicial

    const usuarioFixo: typeUsuario[] = [{
        nome: 'Ruan Lopes',
        nomeLoja: 'Millennium',
        email: 'intel.spec.lopes@gmail.com',
        senha: hashedPassword,
        whatsapp: '556992468120',
        fotoPerfil: '',
        ativo: true
    },{
        nome: 'Silvio Huan',
        nomeLoja: 'Millennium',
        email: 'silvio.huan@gmail.com',
        senha: hashedPassword,
        whatsapp: '556955667788',
        fotoPerfil: '',
        ativo: true
    },{
        nome: 'Luis Felipe',
        nomeLoja: 'Millennium',
        email: 'luis.felipe@gmail.com',
        senha: hashedPassword,
        whatsapp: '556911223344',
        fotoPerfil: '',
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
                nome: mapping.nome(),
                nomeLoja: mapping.nomeLoja(),
                email: mapping.email(),
                senha: mapping.senha(),
                whatsapp: mapping.whatsapp(),
                fotoPerfil: mapping.fotoPerfil(),
                ativo: mapping.ativo(),
                accessToken: mapping.accessToken()
            }
        )
    }

    await modelUsuario.collection.insertMany(usuariosAleatorios);
    console.log(`Seed de ${usuariosAleatorios.length} cadastrado com sucesso!`)
}

export default seedUsuarios;