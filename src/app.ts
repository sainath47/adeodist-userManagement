import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import notesRoutes from './routes/notes.routes';
import morgan from 'morgan';
import createHttpError,{isHttpError} from "http-errors";

const app = express();

app.use(morgan("dev"))

app.use(express.json())

app.use("/api/notes", notesRoutes)

app.use((req, res, next) => {
  next(createHttpError(404,"Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);//logging the error in production is very important as you see the user undergo with error, we can see in the logs that what error he has gone through
  let errorMessage = "An unknown error occurred";
  let statusCode = 500
  // if (error instanceof Error) errorMessage = error.message;
  //now in the below line we check whether the error is the instance of httpError or not
if(isHttpError(error)){
  statusCode = error.status
  errorMessage = error.message
}
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
