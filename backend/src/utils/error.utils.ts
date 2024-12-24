import { getReasonPhrase, StatusCodes } from "http-status-codes";

export class RequestError extends Error {
  constructor(message: string, public name = "", public statusCode: number) {
    super(message);

    const phraseName =
      this.statusCode &&
      getReasonPhrase(this.statusCode)?.toUpperCase().replace(/ /g, "_");
    this.name = this.name || phraseName || "Unidentified Error";
    this.statusCode = statusCode;

    Error.captureStackTrace(this);
  }
}

export class ServiceError extends Error {
  constructor(message: string, public label: `${string}_ERROR`) {
    super(message);

    this.name = this.label;
    Error.captureStackTrace(this);
  }
}

export const createServiceError = (message: string, label: `${string}_ERROR`) =>
  new ServiceError(message, label);

export const createRequestError = (
  message: string,
  name = "",
  statusCode: StatusCodes | number
) => new RequestError(message, name, statusCode);
