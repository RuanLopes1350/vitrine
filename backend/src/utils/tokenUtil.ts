import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';


class TokenUtil {
  /**
   * Gera um token de acesso JWT para o usuário (retorna Promise<string>)
   */
  generateAccessToken(id: string) {
    return new Promise((resolve, reject) => {
      const options: SignOptions = { 
        expiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m') as any
      };
      jwt.sign(
        { id },
        process.env.JWT_SECRET_ACCESS_TOKEN as string,
        options,
        (err, token) => {
          if (err) {
            return reject(err);
          }
          if (!token) {
            return reject(new Error('Falha ao gerar token de acesso'));
          }
          resolve(token);
        }
      );
    });
  }

  /**
   * Gera um token de atualização JWT para o usuário (retorna Promise<string>)
   */
  generateRefreshToken(id: string) {
    return new Promise((resolve, reject) => {
      const options: SignOptions = { 
        expiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d') as any
      };
      jwt.sign(
        { id },
        process.env.JWT_SECRET_REFRESH_TOKEN as string,
        options,
        (err, token) => {
          if (err) {
            return reject(err);
          }
          if (!token) {
            return reject(new Error('Falha ao gerar token de atualização'));
          }
          resolve(token);
        }
      );
    });
  }

  /**
   * Gera token único para recuperação de senha com validade de 1 hora (retorna Promise<string>)
   */
  generatePasswordRecoveryToken(id: string) {
    return new Promise((resolve, reject) => {
      const options: SignOptions = { 
        expiresIn: (process.env.JWT_PASSWORD_RECOVERY_EXPIRATION || '30m') as any
      };
      jwt.sign(
        { id },
        process.env.JWT_SECRET_PASSWORD_RECOVERY as string,
        options,
        (err, token) => {
          if (err) {
            return reject(err);
          }
          if (!token) {
            return reject(new Error('Falha ao gerar token de recuperação de senha'));
          }
          resolve(token);
        }
      );
    });
  }

  /**
   * Decodifica um token de acesso (Bearer) e retorna o payload.id ou rejeita com o erro
   */
  decodeAccessToken(token:string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET_ACCESS_TOKEN as string,
        (err, decoded) => {
          if (err) {
            return reject(err);
          }
          // Type guard para garantir que decoded é JwtPayload e tem id
          if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            resolve((decoded as JwtPayload).id);
          } else {
            reject(new Error('Token payload inválido'));
          }
        }
      );
    });
  }

  /**
   * Decodifica um token de atualização (Bearer) e retorna o payload.id ou rejeita com o erro
   */
  decodeRefreshToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET_REFRESH_TOKEN as string,
        (err, decoded) => {
          if (err) {
            return reject(err);
          }
          if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            resolve((decoded as JwtPayload).id);
          } else {
            reject(new Error('Token payload inválido'));
          }
        }
      );
    });
  }

  /**
   * Decodifica um token de recuperação de senha e retorna o payload.id ou rejeita com o erro
   */
  decodePasswordRecoveryToken(token:string, key = process.env.JWT_SECRET_PASSWORD_RECOVERY as string) {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(
          token,
          key,
          (err, decoded) => {
            if (err) {
              return reject(err);
            }
            if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
              resolve((decoded as JwtPayload).id);
            } else {
              reject(new Error('Token payload inválido'));
            }
          }
        );
      } catch (error) {
        throw new Error('Erro na decodificação do token');
      }
    });
  }
}

export default new TokenUtil();
