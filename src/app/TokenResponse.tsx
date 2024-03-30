"use client";

import { useEffect, useState } from "react";

const payload = {
	n: "01349953",
	b: 1,
	r: "y"
};

export default function TokenResponse()
{
  const [jwtResponse, setJwtResponse] = useState(null);

	useEffect(() => {
		(async () => {
			const result = await fetch("/api/tokenize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
			const res = await result.json();

      setJwtResponse(res);
			console.log(res, res.token.length);
		})();
	}, []);

	return (
		<pre>
			{jwtResponse && JSON.stringify(jwtResponse, null, 2)}
		</pre>
	);
}
