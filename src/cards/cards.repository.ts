import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";

@Injectable()
export class CardsRepository{
    constructor(private readonly prisma: PrismaService) { }

    async create(user: User, { 
        title, 
        name, 
        number, 
        expirationDate, 
        cvv, 
        password, 
        isVirtual, 
        type 
    } : CreateCardDto) {
        return this.prisma.card.create({
            data: {
                title,
                name,
                number,
                expirationDate,
                cvv,
                password,
                isVirtual,
                type,
                user : {
                    connect: user
                }
            }
        })
    }

    // adicionando id eu garanto que outros usuarios consigam
    // criar a credencial com o mesmo titulo/rotulo
    async findOneByTitle(title : string, userId : number) {
        return await this.prisma.card.findFirst({
            where: { title, userId }
        })
    }

    async findAll(userId : number) {
        return await this.prisma.note.findMany({
            where: { userId }
        })
    }

    async findOne(id: number) {
        return await this.prisma.note.findFirst({
            where: { id }
        })
    }

    async delete(id: number) {
        return await this.prisma.note.delete({
            where: { id }
        })
    }
}