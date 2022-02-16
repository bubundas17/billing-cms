class HttpException extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}

export default HttpException;
