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

exports.obterTemplatePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await prisma.template.findUnique({
            where: { id: Number(id) },
            include: {
                fields: true
            }
        });

        if (!template) {
            return res.status(404).json({ error: "Template não encontrado" });
        }

        res.json(template);
    } catch (e) {
        console.error("Erro ao buscar template:", e);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

exports.criarTemplate = async (req, res) => {
    try {
        const { name, description } = req.body;
        const file = req.file;
        let fields = req.body.fields;

        if (typeof fields === 'string') {
            fields = JSON.parse(fields);
        }

        console.log("FILE RECEBIDO:", file);
        console.log("FIELDS PARSED:", fields);



        const novoTemplate = await prisma.template.create({
            data: {
                name,
                imagePath: file.filename,
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
        const templateId = Number(id);

        const templateExcluido = await prisma.template.delete({
            where: { id: templateId },

        });

        return res.json({ mensagem: "Template removido com sucesso", template: templateExcluido });

    } catch (e) {
        res.status(500).json({ e: "Não foi possível excluir o template" });
    }
};



