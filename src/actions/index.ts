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
	applicationIDs: string[],
	date: string = new Date().toISOString().split("T")[0],
	building: number)
{
	return applicationIDs.map((applicationID) => {
		const payload = {
			a: applicationID,
			b: building,
			s: date,
		};

		return [
			applicationID,
			signPayload({ ...payload, r: "y" }),
			signPayload({ ...payload, r: "n" }),
		];
	});
}
