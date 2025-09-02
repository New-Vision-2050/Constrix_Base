export function GET() {
  return Response.json({
    status: 200,
    message: "success",
    payload: [
      { label: "نشط", id: 1 },
      { label: "غير نشط", id: 0 },
    ],
  });
}
