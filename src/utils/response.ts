import { Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { ApiResponse } from '../types/api.types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  status: number = HTTP_STATUS.OK,
): Response => {
  const body: ApiResponse<T> = { success: true, message, ...(data !== undefined && { data }) };
  return res.status(status).json(body);
};

export const sendCreated = <T>(res: Response, message: string, data?: T): Response =>
  sendSuccess(res, message, data, HTTP_STATUS.CREATED);

export const sendError = (
  res: Response,
  message: string,
  status = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: unknown,
): Response => {
  const body: ApiResponse = { success: false, message, ...(errors !== undefined && { errors }) };
  return res.status(status).json(body);
};
