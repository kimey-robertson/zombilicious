import { SocketErrorCodes } from "../../shared/types";

export class SocketError extends Error {
  constructor(
    public code: SocketErrorCodes,
    message: string,
    public details?: any //TODO: make this more specific
  ) {
    super(message);
    this.name = "SocketError";
  }
}
export class OperationFailedError extends SocketError {
  constructor(operation: string, details?: any) {
    super(
      SocketErrorCodes.OPERATION_FAILED,
      `Operation failed: ${operation}`,
      details
    );
  }
}
