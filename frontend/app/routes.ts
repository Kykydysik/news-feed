import { type RouteConfig, index } from "@react-router/dev/routes";
import NewsIndexPage from "./modules/news/routes";

export default [...NewsIndexPage] satisfies RouteConfig;
