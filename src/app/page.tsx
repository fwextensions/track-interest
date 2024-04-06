"use client";

import { useState } from "react";
import DragOverlay from "@/components/DragOverlay";
import SpreadsheetManager from "@/components/SpreadsheetManager";
import BuildingSelector from "@/components/BuildingSelector";

export default function Home()
{
	const [building, setBuilding] = useState(4);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setBuilding(Number(event.target.value));
	};

	return (
		<DragOverlay message="Drop a spreadsheet with applicant emails and IDs here">
			<main>
				<h3>Select a building:</h3>
				<BuildingSelector
					value={building}
					onChange={handleChange}
				/>
				<h3 style={{ marginTop: "2rem" }}>Then drop a file with applicant emails and IDs</h3>
				<SpreadsheetManager building={building} />
			</main>
		</DragOverlay>
	);
}
