"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useDroppedFile } from "@/components/DragOverlay";
import { createTokensForApplicants } from "@/actions";

type InputRow = {
	FirstName: string;
	LastName: string;
	Email: string;
	ApplicantID: string;
};
type OutputRow = InputRow & {
	YesToken: string;
	NoToken: string;
};

function getRowsFromSpreadsheet(
	data: ArrayBuffer)
{
	const workbook = XLSX.read(data);
	const ws = workbook.Sheets[workbook.SheetNames[0]];

		// use the column headers as the keys for each object
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
				const applicantIDs = rows.map(({ ApplicantID }) => ApplicantID);
				const tokens = await createTokensForApplicants(applicantIDs, building);
				const outputRows = tokens.map(([_, YesToken, NoToken], i) => ({
					...rows[i],
					YesToken,
					NoToken,
				}));

				setOutputRows(outputRows);
			})();
		}
	}, [fileData]);

// TODO: add select for building number

	return outputRows.map(({ Email, YesToken, NoToken }) => ([
		<a
			key={YesToken}
			href={`/api/resp/${YesToken}`}
			title={YesToken}
		>
			{Email} <strong>Yes</strong> response
		</a>,
		<a
			key={NoToken}
			href={`/api/resp/${NoToken}`}
			title={NoToken}
		>
			{Email} <strong>No</strong> response
		</a>
	]));
}
