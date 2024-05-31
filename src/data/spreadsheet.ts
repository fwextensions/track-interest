import * as XLSX from "xlsx";
import { createTokensForApplications } from "@/actions";
import { AppIDMap } from "@/app/types";

type InputRow = {
	APPMEM_FIRST_NAME: string;
	APPMEM_LAST_NAME: string;
	APPMEM_EMAIL: string;
	APP_ID_6: string;
	LISTING_ID_6: string;
	APP_ID_7: string;
	LISTING_ID_7: string;
	APP_ID_8: string;
	LISTING_ID_8: string;
	LISTING_NAME: string;
};
export type OutputRow = InputRow & {
	Name: string;
	DueDate: string;
	Buildings: string;
	YesToken1: string;
	YesToken2: string;
	NoToken1: string;
	NoToken2: string;
};

const InputColNames: Extract<keyof InputRow, string>[] = [
	"APPMEM_FIRST_NAME",
	"APPMEM_LAST_NAME",
	"APPMEM_EMAIL",
	"APP_ID_6",
	"LISTING_ID_6",
	"APP_ID_7",
	"LISTING_ID_7",
	"APP_ID_8",
	"LISTING_ID_8",
	"LISTING_NAME"
];
const OutputSheet = "Tokens";
const DuplicateSpacesPattern = /\s+/g;
const MaxFieldLength = 250;

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
	const applications: [AppIDMap, string][] = rows.map((row) => {
		const buildings: string[] = [];
		const appIDs = Object.entries(row).filter(([key]) => key.startsWith("APP_ID"));
		const appIDMap = appIDs.reduce((result: AppIDMap, [key, value]) => {
			const building = key.slice(-1);

			if (value) {
				result[building] = value;
				buildings.push(building);
			}

			return result;
		}, {});

		return [appIDMap, buildings.join(",")];
	});
	const tokens = await createTokensForApplications(applications, sentDate, expDate);

	return tokens.map(([Buildings, YesToken, NoToken], i) => {
		const row = rows[i];
		const Name = (row.APPMEM_FIRST_NAME + " " + row.APPMEM_LAST_NAME).replace(DuplicateSpacesPattern, " ");

		return {
			...row,
			Name,
			DueDate: dueDate,
			Buildings,
			YesToken1: YesToken.slice(0, MaxFieldLength),
			YesToken2: YesToken.slice(MaxFieldLength),
			NoToken1: NoToken.slice(0, MaxFieldLength),
			NoToken2: NoToken.slice(MaxFieldLength),
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
