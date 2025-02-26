export type ServerErrorResponse = {
  status: "error";
  message: {
    type: "error";
    code: string | null;
    name: string | null;
    description: string;
  };
};
