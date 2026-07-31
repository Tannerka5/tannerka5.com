import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { routeRequest } from './router';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return routeRequest(event);
};
