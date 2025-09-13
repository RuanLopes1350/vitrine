import HttpStatusCodes from './httpStatusCodes';

export class CommonResponse {
    private mensagem: string;
    private data: any;
    private erros: any[];
    private erro: boolean;
    private code: number;

    constructor(
        mensagem: string,
        data: any = null,
        erros: any[] = [],
        erro: boolean = false,
        code: number = 200
    ) {
        this.mensagem = mensagem;
        this.data = data;
        this.erros = erros;
        this.erro = erro;
        this.code = code;
    }

    // Métodos estáticos para respostas de sucesso
    static success(mensagem: string, data: any = null, code: number = 200) {
        return new CommonResponse(mensagem, data, [], false, code);
    }

    static created(mensagem: string, data: any = null) {
        return new CommonResponse(mensagem, data, [], false, HttpStatusCodes.CREATED.code);
    }

    // Métodos estáticos para respostas de erro
    static error(mensagem: string, erros: any[] = [], code: number = 500) {
        return new CommonResponse(mensagem, null, erros, true, code);
    }

    static badRequest(mensagem: string, erros: any[] = []) {
        return new CommonResponse(mensagem, null, erros, true, HttpStatusCodes.BAD_REQUEST.code);
    }

    static notFound(mensagem: string = 'Recurso não encontrado') {
        return new CommonResponse(mensagem, null, [], true, HttpStatusCodes.NOT_FOUND.code);
    }

    static unauthorized(mensagem: string = 'Não autorizado') {
        return new CommonResponse(mensagem, null, [], true, HttpStatusCodes.UNAUTHORIZED.code);
    }

    static forbidden(mensagem: string = 'Acesso negado') {
        return new CommonResponse(mensagem, null, [], true, HttpStatusCodes.FORBIDDEN.code);
    }

    static conflict(mensagem: string = 'Conflito de dados') {
        return new CommonResponse(mensagem, null, [], true, HttpStatusCodes.CONFLICT.code);
    }

    static validationError(mensagem: string, erros: any[] = []) {
        return new CommonResponse(mensagem, null, erros, true, HttpStatusCodes.UNPROCESSABLE_ENTITY.code);
    }

    // Métodos para obter valores
    getMensagem(): string {
        return this.mensagem;
    }

    getData(): any {
        return this.data;
    }

    getErros(): any[] {
        return this.erros;
    }

    getCode(): number {
        return this.code;
    }

    isErro(): boolean {
        return this.erro;
    }

    // Converter para JSON
    toJSON() {
        if(this.erro === false) {
            return {
                code: this.code,
                mensagem: this.mensagem,
                data: this.data
            }
        }
        return {
            erro: this.erro,
            code: this.code,
            mensagem: this.mensagem,
            erros: this.erros.length > 0 ? this.erros : undefined
        };
    }

    // Método para resposta Express
    send(res: any) {
        return res.status(this.code).json(this.toJSON());
    }
}