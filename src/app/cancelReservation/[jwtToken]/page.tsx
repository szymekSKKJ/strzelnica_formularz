import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { reservationDelete } from "@/app/api/reservation/delete/route";

const cancelReservationPage = async ({ params: { jwtToken } }: { params: { jwtToken: string } }) => {
  try {
    const decodedJwt = jwt.verify(jwtToken, `${process.env.JWT_TOKEN}`);
    const { bcryptedReservationId, reservationId } = decodedJwt as {
      bcryptedReservationId: string;
      reservationId: string;
    };

    const isValid = bcrypt.compareSync(reservationId, bcryptedReservationId);

    if (isValid) {
      const response = await reservationDelete(reservationId);

      if (response.error === null) {
        return <>Rezerwacja została anulowana</>;
      } else {
        return <>Brak takiej rezerwacji</>;
      }
    } else {
      return <>Brak takiej rezerwacji</>;
    }
  } catch (error) {
    return <>Brak takiej rezerwacji</>;
  }
};

export default cancelReservationPage;
