type ServerResponse<T extends "success" | "error"> = {
  status: T;
  message: {
    type: T;
    code: string | null;
    name: string | null;
    description: string;
  };
};

export type ServerErrorResponse = ServerResponse<"error">;
export type ServerSuccessResponse = ServerResponse<"success">;
