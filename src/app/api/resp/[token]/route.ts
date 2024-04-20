import { redirect } from "next/navigation";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { BuildingIDByNumber } from "@/app/constants";
import { TokenPayload } from "@/app/types";

const secret = process.env.TOKEN_SECRET || "";

export async function GET(
	request: Request,
	{ params }: { params: { token: string } })
{
	const { token } = params;
	let url;

	try {
		const decoded = jwt.verify(token, secret) as TokenPayload;
		const { b, a, r, s } = decoded;

		if (!a || !(b in BuildingIDByNumber) || !r || !s) {
			throw new Error("Invalid token: missing keys");
		}

			// apparently, HEAD requests are also sent to this handler, so we only want
			// to hit Salesforce if the request is a GET
		if (request.method === "GET") {
			console.log("=== save this response to Salesforce", a, b, r, s);
		}

		url = `/response.html?b=${b}&r=${r}`;
	} catch (e) {
		const { message = "Invalid token" } = (e as Error);

		console.error("===", message, token);

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
