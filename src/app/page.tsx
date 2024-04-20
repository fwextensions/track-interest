"use client";

import { useState } from "react";
import DragOverlay from "@/components/DragOverlay";
import SpreadsheetManager from "@/components/SpreadsheetManager";
import BuildingSelector from "@/components/BuildingSelector";
import DateSelector from "@/components/DateSelector";

function toYYYYMMDD(date: Date)
{
	const [month, day, year] = date
		.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
		.split("/");

	return `${year}-${month}-${day}`;
}

export default function Home()
{
	const [building, setBuilding] = useState(1);
	const [sendDate, setSendDate] = useState(toYYYYMMDD(new Date()));

	return (
		<DragOverlay message="Drop a spreadsheet with applicant emails and IDs here">
			<main>
				<BuildingSelector
					value={building}
					onChange={setBuilding}
				/>
				<DateSelector
					value={sendDate}
					onChange={setSendDate}
				/>
				<SpreadsheetManager
					building={building}
					sentDate={sendDate}
				/>
			</main>
		</DragOverlay>
	);
}
