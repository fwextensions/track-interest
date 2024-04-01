import TokenResponse from "@/components/TokenResponse";
import DragOverlay from "@/components/DragOverlay";
import SpreadsheetManager from "@/components/SpreadsheetManager";

export default function Home()
{
	return (
		<DragOverlay message="Drop a spreadsheet with applicant emails here">
			<main>
				<TokenResponse />
				<SpreadsheetManager />
			</main>
		</DragOverlay>
	);
}
