import { RequestHandler } from "express";
import noteModel from "../models/note.model";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
      // throw createHttpError(401)
    const notes = await noteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    if (!mongoose.isValidObjectId(noteId))
      throw createHttpError(400, "Invalid note id");
    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string; // we made this optional because as we are sending the suitable error message for it
  text?: string;
}
//type vs interface, interface is more preferable & should be used instead of type

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody
> = async (req, res, next) => {
  const { title, text } = req.body;

  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const newNote = await noteModel.create({
      title,
      text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

interface UpdateNoteParams {
  noteId: string;
}

interface UpdateNoteBody {
  title?: string;
  text?: string;
}
//types validated here is path params(req.params), --, req.body, req.query
export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const { noteId } = req.params;
  const { title, text } = req.body;
  try {
    if (!mongoose.isValidObjectId(noteId))
      throw createHttpError(400, "Invalid note id");

    if (!title) throw createHttpError(400, "Note must have a title");

    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    note.title = title;
    note.text = text;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
export const deleteNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;
  try {
    if (!mongoose.isValidObjectId(noteId))
      throw createHttpError(400, "Invalid note id");

    const note = await noteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    await note.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
//as you can see in react all dependencies which are installed are in depedencies only no seprate "devDependencies" type of thing exists here , because everthing we are using here(in the react app) are for the development only not for production