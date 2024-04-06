"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useDroppedFile } from "@/components/DragOverlay";
import { createTokensForApplicants } from "@/actions";
import styles from "./SpreadsheetManager.module.css";

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

type Props = {
	building?: number;
};

export default function SpreadsheetManager({
	building = 0 }: Props)
{
	const fileData = useDroppedFile();
	const [outputRows, setOutputRows] = useState<OutputRow[]>([]);

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

// TODO: generate the spreadsheet on drop

	return (
		<ul className={styles.applicantList}>
			{outputRows.map(({ Email, YesToken, NoToken }) => (
				<li key={Email}>
					{Email}
					<a
						href={`/api/resp/${YesToken}`}
						title={YesToken}
					>
						<strong>Yes</strong>
					</a>
					<a
						href={`/api/resp/${NoToken}`}
						title={NoToken}
					>
						<strong>No</strong>
					</a>
				</li>
			))}
		</ul>
	);
}
