import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";
import { User } from "@prisma/client";

@Injectable()
export class CredentialsRepository {
    constructor(private readonly prisma: PrismaService) { }
    
    async create(user: User, { title, url, username, password } : CreateCredentialDto) {
        return this.prisma.credential.create({
            data: {
                title,
                url,
                username, 
                password,
                user : {
                    connect: user
                }
            }
        })
    }

    // adicionando id eu garanto que outros usuarios consigam
    // criar a credencial com o mesmo titulo/rotulo
    async getCredentialByTitle(title : string, userId : number) {
        return await this.prisma.credential.findFirst({
            where: { title, userId }
        })
    }

    async findAll(userId : number) {
        return await this.prisma.credential.findMany({
            where: { userId }
        })
    }

    async findOne(id: number) {
        return await this.prisma.credential.findFirst({
            where: { id }
        })
    }

    async delete(id: number) {
        return await this.prisma.credential.delete({
            where: { id }
        })
    }
    
}