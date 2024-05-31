"use server";

import jwt from "jsonwebtoken";
import { AppIDMap, TokenPayload } from "@/app/types";

const Secret = process.env.TOKEN_SECRET || "";

const signPayload = (payload: TokenPayload) => jwt.sign(payload, Secret);

export async function createTokensForApplications(
	applications: [AppIDMap, string][],
	date: string,
	exp: number)
{
	return applications.map(([appIDMap, buildings]) => {
			// supply an expiration time in seconds on the payload itself, rather than
			// using the options object
		const payload = {
			exp,
			s: date,
			m: appIDMap
		};

		return [
			buildings,
			signPayload({ ...payload, r: "y" }),
			signPayload({ ...payload, r: "n" }),
		];
	});
}
