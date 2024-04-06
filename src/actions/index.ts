"use server";

import jwt from "jsonwebtoken";
import { RespSubject, RespTime } from "@/app/constants";
import { TokenPayload } from "@/app/types";

const Secret = process.env.TOKEN_SECRET || "";
const Options = {
	subject: RespSubject,
	expiresIn: RespTime,
};

function signPayload(
	payload: TokenPayload)
{
	return jwt.sign(payload, Secret, Options);
}

export async function createTokensForApplicants(
	applicantIDs: string[],
	building: number)
{
	return applicantIDs.map((applicantID) => {
		const payload = {
			n: applicantID,
			b: building,
		};

		return [
			applicantID,
			signPayload({ ...payload, r: "y" }),
			signPayload({ ...payload, r: "n" }),
		];
	});
}
