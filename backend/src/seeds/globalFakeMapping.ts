import { faker } from '@faker-js/faker/locale/pt_BR'

export async function getGlobalFakeMapping() {
    return {
        usuario: {
            nome: () => faker.person.fullName(),
            email: () => faker.internet.email(),
            senha: () => faker.internet.password(),
            whatsapp: () => faker.phone.number(),
            ativo: () => faker.datatype.boolean()
        },
        produto: {
            criador: () => faker.person.fullName(),
            nome_produto: () => faker.commerce.productName(),
            descricao: () => faker.lorem.lines(3),
            preco: () => faker.commerce.price(),
            imagem: () => faker.image.urlPicsumPhotos(),
            ativo: () => faker.datatype.boolean(),
            mensagem: () => faker.lorem.lines(1)
        }
    }
}