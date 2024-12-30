import * as bcrypt from 'bcrypt'; // Альтернативный импорт, если 'bcrypt' не работает

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
  const salt = await bcrypt.genSalt(saltRounds); // генерируем соль с указанным параметром сложности

  return await bcrypt.hash(password, salt);
}
