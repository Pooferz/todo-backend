import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import  cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(express.json())
app.use(cors())
const port = process.env.BACKEND_PORT || 3001;
const prisma = new PrismaClient()

app.get("/tasks", async(req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  res.status(200).send(
    {
      tasks
    }
  );
});

app.post('/tasks', async(req: Request, res: Response) => {
  try {
    const newTask = await prisma.task.create({
      data: {
        ...req.body
      },
    });
    console.log('task created:', newTask);
    res.status(200).send(newTask);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  } finally {
    await prisma.$disconnect();
  }
})

app.delete('/tasks/:id', async(req: Request, res: Response) => {
  const { id } = req.params
  try {
    const tasks = await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    })
    res.status(200).send(true)
  } catch (error) {
    console.log(error);
    res.status(200).send(true);
  }
})

app.put('/tasks/:id', async(req: Request, res: Response) => {
  const resourceId = parseInt(req.params.id);
  const { id, ...updatedFields } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: resourceId},
      data: {
        ...updatedFields
      }
    });
    res.status(200).send(updatedTask)
  } catch (error) {
    console.log(error);
    res.status(200).send(error);
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});