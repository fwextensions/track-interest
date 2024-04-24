import jwt from "jsonwebtoken";

const secret = process.env.TOKEN_SECRET || "";

export async function POST(
	request: Request)
{
	try {
		const payload = await request.json();
		const token = jwt.sign(payload, secret);

		return Response.json({ token });
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
