import jwt from "jsonwebtoken";

const secret = process.env.TOKEN_SECRET || "";
const options = { subject: "resp" };

export async function POST(
	request: Request)
{
	const payload = await request.json();
	const token = jwt.sign(payload, secret, options);

	return Response.json({ token });
}
