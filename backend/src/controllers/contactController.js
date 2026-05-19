import { body } from "express-validator";
import { contactModel } from "../models/contactModel.js";
import { AppError } from "../utils/AppError.js";

export const contactValidation = [
  body("fullName").trim().notEmpty().withMessage("Le nom est requis"),
  body("email").isEmail().withMessage("Adresse email invalide"),
  body("message").trim().isLength({ min: 5 }).withMessage("Le message doit contenir au moins 5 caractères")
];

export const submitContact = async (req, res) => {
  const contact = await contactModel.create(req.body);
  return res.status(201).json({ message: "Message sent successfully", contact });
};

export const listMessages = async (req, res) => {
  const messages = await contactModel.list();
  return res.json(messages);
};

export const updateMessageStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "read", "done"];
  if (!allowed.includes(status)) {
    return res.status(422).json({ message: "Statut invalide" });
  }

  const message = await contactModel.updateStatus(req.params.id, status);
  if (!message) throw new AppError("Message not found", 404);

  return res.json(message);
};
