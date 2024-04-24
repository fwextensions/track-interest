import * as XLSX from "xlsx";
import { createTokensForApplications } from "@/actions";
import { BuildingNumberByName } from "@/app/constants";

type InputRow = {
	APPMEM_FIRST_NAME: string;
	APPMEM_LAST_NAME: string;
	APPMEM_EMAIL: string;
	APP_ID: string;
	LISTING_ID: string;
	LISTING_NAME: string;
};
export type OutputRow = InputRow & {
	Name: string;
	DueDate: string;
	Building: number;
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
const DuplicateSpacesPattern = /\s+/g;

function link(
	token: string)
{
	return `https://housing.sfgov.org/api/v1/trk?t=${token}`;
}

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
	dueDate: string,
	expDate: number)
{
	const fileData = await file.arrayBuffer();
		// create new row objects with only keys that are in InputRow
	const rows = getRowsFromSpreadsheet(fileData)
		.map((row) => InputColNames.reduce((o, k) => ({ ...o, [k]: row[k] }), {} as InputRow));
	const applications = rows.map(({ APP_ID, LISTING_NAME }): [string, number] => {
		const building = BuildingNumberByName[LISTING_NAME];

		return [APP_ID, building];
	});
	const tokens = await createTokensForApplications(applications, sentDate, expDate);

	return tokens.map(([[_, building], YesToken, NoToken], i) => {
		const row = rows[i];
		const Name = (row.APPMEM_FIRST_NAME + " " + row.APPMEM_LAST_NAME).replace(DuplicateSpacesPattern, " ");

		return {
			...row,
			Name,
			DueDate: dueDate,
			Building: building,
			YesLink: link(YesToken),
			NoLink: link(NoToken),
		};
	});
}

export function writeWorkbookFromRows(
	rows: OutputRow[],
	sentDate: string,
	filename: string = "Output")
{
	const workbook = getWorkbookFromRows(rows);
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	const filenameOnly = filename.replace(/\.[^.]*$/, "");
	const outputFilename = `${filenameOnly} - sent ${sentDate} - tokens ${timestamp}.xlsx`;

	XLSX.writeFile(workbook, outputFilename);
}
