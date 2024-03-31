import { redirect } from "next/navigation";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { RespSubject } from "@/app/constants";
import { TokenPayload } from "@/app/types";

const secret = process.env.TOKEN_SECRET || "";
const options = {
	subject: RespSubject,
};

export async function GET(
	request: Request,
	{ params }: { params: { token: string } })
{
	const { token } = params;
	let url;

	try {
		const decoded = jwt.verify(token, secret, options) as TokenPayload;
		const { n, b, r } = decoded;

		console.log("==== save this response to Salesforce", n, b, r);

		url = `/response/${b}/${r}`;
	} catch (e) {
		const { message = "Invalid token" } = (e as Error);

		console.error("====", message, token);

		if (e instanceof TokenExpiredError) {
			url = "/expired";
		} else {
			return Response.json({ error: message }, { status: 500 });
		}
	}

		// for some crazy reason, this redirect() has to be outside the try/catch
		// block to work
	redirect(url);
}
