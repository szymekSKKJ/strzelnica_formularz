export type Response<dataTypeResponse> = {
  error: null | string;
  data: null | dataTypeResponse;
};

const createResponse = <T>(error: string | null, data: T) => {
  return Response.json({ error: error, data: data });
};

export default createResponse;
