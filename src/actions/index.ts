"use server";

import jwt from "jsonwebtoken";
import { TokenPayload } from "@/app/types";

const Secret = process.env.TOKEN_SECRET || "";

const signPayload = (payload: TokenPayload) => jwt.sign(payload, Secret);

export async function createTokensForApplications(
	applications: [string, number][],
	date: string,
	exp: number): Promise<[[string, number], string, string][]>
{
	return applications.map(([applicationID, building]) => {
			// supply an expiration time in seconds on the payload itself, rather than
			// using the options object
		const payload = {
			exp,
			a: applicationID,
			b: building,
			s: date,
		};

		return [
			[applicationID, building],
			signPayload({ ...payload, r: "y" }),
			signPayload({ ...payload, r: "n" }),
		];
	});
}
