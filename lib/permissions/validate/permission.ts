import z from "zod";

export const permissionSchema = z.object({
  key: z.string().min(1, "Permission key cannot be empty"),
});

export const permissionsSchema = z.array(permissionSchema);
