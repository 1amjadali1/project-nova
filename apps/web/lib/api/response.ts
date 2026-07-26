import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
  };
}

export class APIResponse {
  static success<T>(data: T, meta?: Record<string, unknown>, status = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
        meta,
      } as ApiResponse<T>,
      { status }
    );
  }

  static error(code: string, message: string, status = 400) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
        },
      } as ApiResponse<null>,
      { status }
    );
  }
}
