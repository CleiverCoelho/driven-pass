import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";

@Injectable()
export class NotesRepository{
    constructor(private readonly prisma: PrismaService) { }

    async create(user: User, { title, content } : CreateNoteDto) {
        return this.prisma.note.create({
            data: {
                title,
                content,
                user : {
                    connect: user
                }
            }
        })
    }

    // adicionando id eu garanto que outros usuarios consigam
    // criar a credencial com o mesmo titulo/rotulo
    async findOneByTitle(title : string, userId : number) {
        return await this.prisma.note.findFirst({
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