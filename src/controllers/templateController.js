const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Template = require("../models/templateModel");

exports.listarTemplates = async (req, res) => {
    try {
        const templates = await prisma.template.findMany({
            include: {
                fields: true 
            }
        });
        res.json(templates);
    } catch (e) {
        console.error("Erro ao listar templates:", e);
        res.status(500).json({ e: "Não foi possível listar os templates" });
    }
};

exports.criarTemplate = async (req, res) => {
    try {
        const { name, description, fields } = req.body;

        const novoTemplate = await prisma.template.create({
            data: {
                name,
                description,
                fields: {
                    create: fields.map(i => ({
                        name: i.name,
                        x: Number(i.x),
                        y: Number(i.y),
                        width: Number(i.width),
                        height: Number(i.height)
                    }))
                } 
            }
        });

        res.status(201).json(novoTemplate);
    } catch (e) {
        console.error("Erro ao criar template:", e);
        res.status(500).json({ erro: "Não foi possível criar o template" });
    }
};

exports.excluirTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const templateExcluido = await prisma.template.findByIdAndDelete(id);

        if (!templateExcluido) {
            return res.status(404).json({ e: "Template não foi encontrado" });
        }

        res.json({ mensagem: "Template removido com sucesso" });
    } catch (e) {
        res.status(500).json({ e: "Não foi possível excluir o template" });
    }
};


