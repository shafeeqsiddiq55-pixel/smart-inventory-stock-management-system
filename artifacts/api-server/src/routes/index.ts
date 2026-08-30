import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import cartRouter from "./cart";
import wishlistRouter from "./wishlist";
import ordersRouter from "./orders";
import reviewsRouter from "./reviews";
import couponsRouter from "./coupons";
import contactRouter from "./contact";
import adminRouter from "./admin";import fruitAssistantRouter from "./fruit-assistant";
const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(wishlistRouter);
router.use(ordersRouter);
router.use(reviewsRouter);
router.use(couponsRouter);
router.use(contactRouter);
router.use(fruitAssistantRouter);
router.use(adminRouter);

export default router;
