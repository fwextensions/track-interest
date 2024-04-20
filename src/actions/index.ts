"use server";

import jwt from "jsonwebtoken";
import { RespTime } from "@/app/constants";
import { TokenPayload } from "@/app/types";

const Secret = process.env.TOKEN_SECRET || "";
const Options = {
	expiresIn: RespTime,
};

function signPayload(
	payload: TokenPayload)
{
	return jwt.sign(payload, Secret, Options);
}

export async function createTokensForApplications(
	applications: [string, number][],
	date: string): Promise<[[string, number], string, string][]>
{
	return applications.map(([applicationID, building]) => {
		const payload = {
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
