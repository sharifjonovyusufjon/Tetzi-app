import { Request, Response } from "express";
import { T } from "../libs/types/common";
import CommentService from "../models/Comment.service";

const commentController: T = {};
const commentService = new CommentService();
