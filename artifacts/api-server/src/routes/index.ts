import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import userRouter from "./user";
import trackerRouter from "./tracker";
import symptomsRouter from "./symptoms";
import periodsRouter from "./periods";
import recommendationsRouter from "./recommendations";
import bookingsRouter from "./bookings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(userRouter);
router.use(trackerRouter);
router.use(symptomsRouter);
router.use(periodsRouter);
router.use(recommendationsRouter);
router.use(bookingsRouter);

export default router;
