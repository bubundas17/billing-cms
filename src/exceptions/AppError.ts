class AppError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}

export default AppError;
