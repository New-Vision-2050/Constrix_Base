type ServerResponse<T extends "success" | "error", P = null> = {
  status: T;
  message: {
    type: T;
    code: string | null;
    name: string | null;
    description: string;
  };
  payload?: P;
  error?: string;
};

export type ServerErrorResponse<P = null> = ServerResponse<"error", P>;
export type ServerSuccessResponse<P = null> = ServerResponse<"success", P>;
