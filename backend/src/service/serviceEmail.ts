interface SendEmailParams {
    to: string;
    subject: string;
    template: string;
    data?: Record<string, any>;
}

class ServiceEmail {
    private mailServiceUrl: string;
    private apiKey: string;

    constructor() {
        this.mailServiceUrl = process.env.MAIL_SERVICE_URL || 'http://localhost:3010';
        this.apiKey = process.env.MAIL_SERVICE_API_KEY || '';
    }

    async enviarEmailBoasVindas(nome: string, email: string): Promise<boolean> {
        try {
            const emailData = {
                to: email,
                subject: 'Bem-vindo ao Vitrine! 🎉',
                template: 'bemvindo',
                data: {
                    nome: nome,
                    ano: new Date().getFullYear(),
                    ctaUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
                }
            };

            await this.enviarEmail(emailData);
            console.log(`Email de boas-vindas enviado para: ${email}`);
            return true;
        } catch (error) {
            console.error('Erro ao enviar email de boas-vindas:', error);
            return false;
        }
    }

    async enviarEmailRecuperacaoSenha(nome: string, email: string, tokenRecuperacao: string): Promise<boolean> {
        try {
            const emailData = {
                to: email,
                subject: 'Recuperação de Senha - Vitrine',
                template: 'generico',
                data: {
                    nome: nome,
                    titulo: 'Recuperação de Senha',
                    mensagem: `Você solicitou a recuperação de sua senha. Clique no link abaixo para criar uma nova senha:`,
                    ctaUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${tokenRecuperacao}`,
                    ctaTexto: 'Recuperar Senha',
                    ano: new Date().getFullYear()
                }
            };

            await this.enviarEmail(emailData);
            console.log(`Email de recuperação de senha enviado para: ${email}`);
            return true;
        } catch (error) {
            console.error('Erro ao enviar email de recuperação de senha:', error);
            return false;
        }
    }

    private async enviarEmail(emailParams: SendEmailParams): Promise<void> {
        if (!this.apiKey) {
            throw new Error('API Key do serviço de email não configurada');
        }

        const response = await fetch(`${this.mailServiceUrl}/emails/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(emailParams)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falha ao enviar email: ${response.status} - ${errorText}`);
        }

        return await response.json();
    }
}

export default ServiceEmail;
