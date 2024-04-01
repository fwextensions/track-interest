"use client";

import { useDroppedFile } from "@/components/DragOverlay";

const decoder = new TextDecoder("utf-8");

export default function SpreadsheetManager()
{
	const fileData = useDroppedFile();
	const fileString = fileData ? decoder.decode(fileData).slice(0, 100) : "";

	return (
		<div>
			{fileString}
		</div>
	);
}
