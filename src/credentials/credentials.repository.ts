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

    async getCredentialByTitle(title : string) {
        return await this.prisma.credential.findFirst({
            where: { title }
        })
    }
}