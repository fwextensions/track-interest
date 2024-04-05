"use client";

import { useEffect, useState } from "react";
import ky from "ky";
import * as XLSX from "xlsx";
import { useDroppedFile } from "@/components/DragOverlay";

type InputRow = {
	AppID: string;
	FirstName: string;
	LastName: string;
	Email: string;
};
type OutputRow = InputRow & {
	YesToken: string;
	NoToken: string;
};

const TokenizeURL = "/api/tokenize";

function getRowsFromSpreadsheet(
	data: ArrayBuffer)
{
	const workbook = XLSX.read(data);
	const ws = workbook.Sheets[workbook.SheetNames[0]];

	return XLSX.utils.sheet_to_json(ws) as InputRow[];
}

export default function SpreadsheetManager()
{
	const fileData = useDroppedFile();
	const [outputRows, setOutputRows] = useState<OutputRow[]>([]);
	const building = 1;

	useEffect(() => {
		if (fileData) {
			(async () => {
				const rows = getRowsFromSpreadsheet(fileData);
				const outputRows = [];

				for (const row of rows) {
					const payload = {
						n: row.AppID,
						b: building,
					};
					const YesToken = (await ky.post(TokenizeURL, { json: { ...payload, r: "y" } }).json())?.token;
					const NoToken = (await ky.post(TokenizeURL, { json: { ...payload, r: "n" } }).json())?.token;

					outputRows.push({
						...row,
						YesToken,
						NoToken,
					});
				}

				setOutputRows(outputRows);
			})();
		}
	}, [fileData]);

// TODO: add select for building number

	return (
		<>
			{outputRows.map(({ Email, YesToken, NoToken }) => (
				<>
					<a
						key={YesToken}
						href={`/api/resp/${YesToken}`}
						title={YesToken}
					>
						{Email} <strong>Yes</strong> response
					</a>
					<a
						key={NoToken}
						href={`/api/resp/${NoToken}`}
						title={NoToken}
					>
						{Email} <strong>No</strong> response
					</a>
				</>
			))}
		</>
	);
}
