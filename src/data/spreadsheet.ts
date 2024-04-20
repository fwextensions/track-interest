import { createTokensForApplications } from "@/actions";
import * as XLSX from "xlsx";

type InputRow = {
	APPMEM_FIRST_NAME: string;
	APPMEM_LAST_NAME: string;
	APPMEM_EMAIL: string;
	APP_ID: string;
	LISTING_ID: string;
	LISTING_NAME: string;
};
export type OutputRow = InputRow & {
	YesLink: string;
	NoLink: string;
};

const InputColNames: Extract<keyof InputRow, string>[] = [
	"APPMEM_FIRST_NAME",
	"APPMEM_LAST_NAME",
	"APPMEM_EMAIL",
	"APP_ID",
	"LISTING_ID",
	"LISTING_NAME"
];
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

export async function getOutputFromSpreadsheet(
	file: File,
	sentDate: string,
	building: number)
{
	const fileData = await file.arrayBuffer();
	const rows = getRowsFromSpreadsheet(fileData)
		.map((row) => InputColNames.reduce((o, k) => ({ ...o, [k]: row[k] }), {} as InputRow));
	const applicationIDs = rows.map(({ APP_ID }) => APP_ID);
// TODO: specify building uniquely for each APP_ID
	const tokens = await createTokensForApplications(applicationIDs, sentDate, building);
	const outputRows = tokens.map(([_, YesToken, NoToken], i) => ({
		...rows[i],
		YesLink: link(YesToken),
		NoLink: link(NoToken),
	}));

	return outputRows;
}

export function writeWorkbookFromRows(
	rows: OutputRow[],
	filename: string = "Output")
{
	const workbook = getWorkbookFromRows(rows);
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	const outputFilename = `${filename.replace(/\.[^.]*$/, "")} - tokens ${timestamp}.xlsx`;

	XLSX.writeFile(workbook, outputFilename);
}
