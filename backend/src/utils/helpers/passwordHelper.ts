// full-path: utils/helpers/passwordHelper.ts
import bcrypt from 'bcrypt';

/**
 * Classe auxiliar para lidar com operações de senha usando bcrypt.
 */
export class PasswordHelper {
    // Define o "custo" do hash. 10 é um bom valor padrão.
    private static readonly SALT_ROUNDS = 10;

    /**
     * Gera o hash de uma senha em texto puro.
     * @param password 
     * @returns 
     */
    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Compara uma senha em texto puro com um hash existente.
     * @param plainPassword
     * @param hashedPassword 
     * @returns 
     */
    static async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}
