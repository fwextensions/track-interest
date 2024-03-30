import jwt from "jsonwebtoken";
import { RespSubject, RespTime } from "@/app/constants";

const secret = process.env.TOKEN_SECRET || "";
const options = {
	subject: RespSubject,
	expiresIn: RespTime,
};

export async function POST(
	request: Request)
{
	try {
		const payload = await request.json();
		const token = jwt.sign(payload, secret, options);

		return Response.json({ token });
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
