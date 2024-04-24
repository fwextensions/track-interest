"use client";

import { useState } from "react";
import { add, format, getUnixTime, parse } from "date-fns";
import DragOverlay from "@/components/DragOverlay";
import SpreadsheetManager from "@/components/SpreadsheetManager";
import DateSelector from "@/components/DateSelector";
import { DueDateOffset, ExpDateOffset } from "@/app/constants";

export default function Home()
{
	const [sentDate, setSentDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const sentDateObject = parse(sentDate, "yyyy-MM-dd", new Date());
	const dueDate = add(sentDateObject, DueDateOffset);
	const dueDateString = format(dueDate, "EEEE, MMMM do");
	const expDate = getUnixTime(add(sentDateObject, ExpDateOffset));

	return (
		<DragOverlay message="Drop a spreadsheet with applicant emails and IDs here">
			<main>
				<DateSelector
					defaultValue={sentDate}
					onChange={setSentDate}
				/>
				<p>
					<strong>Due date:</strong> {dueDateString}
				</p>
				<p>
					<strong>Exp date:</strong> {new Date(expDate * 1000).toLocaleString()}
				</p>
				<SpreadsheetManager
					sentDate={sentDate}
					dueDate={dueDateString}
					expDate={expDate}
				/>
			</main>
		</DragOverlay>
	);
}
