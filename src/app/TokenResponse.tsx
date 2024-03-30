"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ky from "ky";

const TokenizeURL = "/api/tokenize";
const PayloadDefaults = {
	n: "01349953",
	b: 1,
};
const ResponseValues = ["y", "n"];
const Payloads = ResponseValues.map((r) => ({ ...PayloadDefaults, r }));

export default function TokenResponse()
{
	const [tokens, setTokens] = useState<[string, string][]>([]);

	useEffect(() => {
		(async () => {
			const results = await Promise.all<{ token: string }>(Payloads.map(
				(payload) => ky.post(TokenizeURL, { json: payload }).json()
			));

			setTokens(results.map(({ token }, i) => [ResponseValues[i], token]));
		})();
	}, []);

	return (
		<>
			{tokens.map(([response, token]) => (
				<Link
					key={token}
					href={`/api/resp/${token}`}
					title={token}
				>
					Send <strong>{response}</strong> response
				</Link>
			))}
		</>
	);
}
