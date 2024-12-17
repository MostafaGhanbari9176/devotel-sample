export class MessageResponseDTO {
  statusCode: number;

  message: string;
}

export class ListResponseDTO {
  statusCode: number;

  page?: number;

  pageCount?: number;
}

export class EntityResponseDTO {
  statusCode: number;
}

export class ErrorResponseDTO extends MessageResponseDTO {
  readonly error: string;
}
