"use client";

import { useState } from "react";
import DragOverlay from "@/components/DragOverlay";
import SpreadsheetManager from "@/components/SpreadsheetManager";
import DateSelector from "@/components/DateSelector";

export default function Home()
{
		// convert the current date to YYYY-MM-DD, which fr-CA returns
	const [sendDate, setSendDate] = useState(new Date().toLocaleDateString("fr-CA"));

	return (
		<DragOverlay message="Drop a spreadsheet with applicant emails and IDs here">
			<main>
				<DateSelector
					defaultValue={sendDate}
					onChange={setSendDate}
				/>
				<SpreadsheetManager
					sentDate={sendDate}
				/>
			</main>
		</DragOverlay>
	);
}
