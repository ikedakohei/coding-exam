import type { NextApiRequest, NextApiResponse } from 'next';
import handler from './index';

const mockResponse = () => {
  const res: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  };
  return res as NextApiResponse;
};
describe('/api/todos', () => {
  it('should return 200 and an array of todos', async () => {
    const req = { method: 'GET' } as NextApiRequest;
    const res = mockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });
});
