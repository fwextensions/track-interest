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
	file: File,
	building: number)
{
	const fileData = await file.arrayBuffer();
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
	rows: OutputRow[],
	filename: string = "Output")
{
	const workbook = getWorkbookFromRows(rows);
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	const outputFilename = `${filename.replace(/\.[^.]*$/, "")} - tokens ${timestamp}.xlsx`;

	XLSX.writeFile(workbook, outputFilename);
}

type Props = {
	building?: number;
};

export default function SpreadsheetManager({
	building = 0 }: Props)
{
	const file = useDroppedFile();
	const [outputRows, setOutputRows] = useState<OutputRow[]>([]);
	const [isPending, startTransition] = useTransition();
	let renderedRows = isPending ? [] : outputRows;

	const handleClick = () => {
		if (file && outputRows.length) {
			writeWorkbookFromRows(outputRows, file.name);
		}
	};

	useEffect(() => {
		if (file) {
			startTransition(async () => {
				const rows = await getOutput(file, building);

				setOutputRows(rows);
			});
		}
	}, [file]);

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
					onClick={handleClick}
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
