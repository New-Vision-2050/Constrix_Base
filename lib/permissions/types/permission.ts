import z from "zod";
import { permissionSchema } from "../validate/permission";

export type Permission = z.infer<typeof permissionSchema>;
