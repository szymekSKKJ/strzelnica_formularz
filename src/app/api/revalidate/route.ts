import { revalidatePath, revalidateTag } from "next/cache";
import createResponse from "../createResponse";

const POST = async () => {
  revalidatePath("/");

  return createResponse(null, null);
};

export { POST };

const revalidateData = async () => {
  return await fetch(new Request(`${process.env.NEXT_PUBLIC_URL}/api/revalidate`, { method: "POST", cache: "no-cache" }));
};

export { revalidateData };
