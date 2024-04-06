import { Buildings } from "@/app/constants";

type Props = {
	params: {
		building: number;
		response: "y" | "n";
	}
};

export default function Response(
	props: Props)
{
	const { building, response } = props.params;
	const responseString = response === "y"
		? "Yes, I am interested"
		: "No longer interested";
	const buildingName = Buildings[building][0];

	return (
		<main>
			<p>
				Thank you for registering your response to <strong>{buildingName}</strong> as <strong>{responseString}</strong>!
			</p>
		</main>
	);
}
