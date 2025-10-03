import { faker } from '@faker-js/faker/locale/pt_BR'

export async function getGlobalFakeMapping() {
    return {
        usuario: {
            nome: () => faker.person.fullName(),
            nomeLoja: () => faker.company.name(),
            email: () => faker.internet.email(),
            senha: () => faker.internet.password(),
            whatsapp: () => faker.phone.number(),
            fotoPerfil: () => faker.image.avatar(),
            mensagem: () => faker.lorem.sentence(),
            ativo: () => faker.datatype.boolean()
        },
        produto: {
            criador: () => faker.person.fullName(),
            nome_produto: () => faker.commerce.productName(),
            descricao: () => faker.lorem.lines(3),
            preco: () => faker.commerce.price(),
            imagem: () => faker.image.urlPicsumPhotos(),
            ativo: () => faker.datatype.boolean()
        }
    }
}