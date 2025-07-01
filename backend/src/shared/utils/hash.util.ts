import * as bcrypt from 'bcrypt';

export class HashUtil {
  async hash(data: string): Promise<string> {
    const hashed: string = await bcrypt.hash(data, 10);
    return hashed;
  }

  async compare(data: string, hash: string): Promise<boolean> {
    const result: boolean = await bcrypt.compare(data, hash);
    return result;
  }
}
