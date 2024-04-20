import { useEffect, useState, useTransition } from "react";
import { useDroppedFile } from "@/components/DragOverlay";
import styles from "./SpreadsheetManager.module.css";
import {
	getOutputFromSpreadsheet,
	writeWorkbookFromRows,
	OutputRow,
} from "@/data/spreadsheet";

type Props = {
	building?: number;
	sentDate: string;
};

export default function SpreadsheetManager({
	sentDate,
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
				const rows = await getOutputFromSpreadsheet(file, sentDate, building);

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
			<h3>Then drop a file with applicant emails and IDs:</h3>
			{!!outputRows.length &&
				<button
					className={styles.downloadButton}
					onClick={handleClick}
				>
					Download Tokens
				</button>}
			<ul className={styles.applicantList}>
				{renderedRows.map(({ APPMEM_EMAIL, YesLink, NoLink }, i) => (
					<li key={i}>
						{APPMEM_EMAIL}
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
