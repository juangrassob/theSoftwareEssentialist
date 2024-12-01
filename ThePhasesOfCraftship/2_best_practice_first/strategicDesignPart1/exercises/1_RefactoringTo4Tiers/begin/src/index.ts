import express, { Request, Response } from "express";
import { prisma } from "./database";
import { Student, Class, Assignment, StudentAssignment } from "@prisma/client";
import { error } from "console";
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// API Endpoints

// POST student created

// POST class created

// POST student assigned to class
// POST assignment created

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
