import bcrypt from 'bcrypt'

export const generateBcryptCode = async (plainText, salt) => {
    return (await bcrypt.hash(plainText, salt)).toString()
}