"use client";

import { useEffect, useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { useDroppedFile } from "@/components/DragOverlay";
import { createTokensForApplicants } from "@/actions";
import styles from "./SpreadsheetManager.module.css";

type InputRow = {
	FirstName: string;
	LastName: string;
	Email: string;
	ApplicantID?: string;
	APP_ID: string;
};
type OutputRow = InputRow & {
	YesLink: string;
	NoLink: string;
};

const OutputSheet = "Tokens";

//const link = (token: string) => `/api/resp/${token}`;
const link = (token: string) => `https://track-interest.vercel.app/api/resp/${token}`;

function getRowsFromSpreadsheet(
	data: ArrayBuffer)
{
	const workbook = XLSX.read(data);
	const ws = workbook.Sheets[workbook.SheetNames[0]];

		// use the column headers as the keys for each object
	return XLSX.utils.sheet_to_json(ws) as InputRow[];
}

function getWorkbookFromRows(
	rows: OutputRow[])
{
	return {
		SheetNames: [OutputSheet],
		Sheets: {
			[OutputSheet]: XLSX.utils.json_to_sheet(rows)
		}
	};
}

async function getOutput(
	fileData: ArrayBuffer,
	building: number)
{
	const rows = getRowsFromSpreadsheet(fileData);
	const applicantIDs = rows.map(({ ApplicantID, APP_ID }) => ApplicantID || APP_ID);
	const tokens = await createTokensForApplicants(applicantIDs, building);
	const outputRows = tokens.map(([_, YesToken, NoToken], i) => ({
		...rows[i],
		YesLink: link(YesToken),
		NoLink: link(NoToken),
	}));

	return outputRows;
}

function writeWorkbookFromRows(
	rows: OutputRow[])
{
	const workbook = getWorkbookFromRows(rows);

	XLSX.writeFile(workbook, "tokens.xlsx");
}

type Props = {
	building?: number;
};

export default function SpreadsheetManager({
	building = 0 }: Props)
{
	const fileData = useDroppedFile();
	const [outputRows, setOutputRows] = useState<OutputRow[]>([]);
	const [isPending, startTransition] = useTransition();
	let renderedRows = isPending ? [] : outputRows;

	useEffect(() => {
		if (fileData) {
			startTransition(async () => {
				const rows = await getOutput(fileData, building);

				setOutputRows(rows);
			});
		}
	}, [fileData]);

	if (isPending) {
		return <div className={styles.pendingMessage}>Generating tokens...</div>;
	}

	if (renderedRows.length > 40) {
		renderedRows = [...outputRows.slice(0, 20), ...outputRows.slice(-20)];
	}

	return (
		<>
			{!!outputRows.length &&
				<button
					className={styles.downloadButton}
					onClick={() => writeWorkbookFromRows(outputRows)}
				>
					Download Tokens
				</button>}
			<ul className={styles.applicantList}>
				{renderedRows.map(({ Email, YesLink, NoLink }, i) => (
					<li key={i}>
						{Email}
						<a
							href={YesLink}
							title={YesLink}
							target="_blank"
						>
							<strong>Yes</strong>
						</a>
						<a
							href={NoLink}
							title={NoLink}
							target="_blank"
						>
							<strong>No</strong>
						</a>
					</li>
				))}
			</ul>
		</>
	);
}
