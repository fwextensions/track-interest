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
	const responseString = response === "y" ? "Yes" : "No";

	return (
		<main>
			<p>
				Thank you for registering your response to building <strong>{building}</strong> as <strong>{responseString}</strong>!
			</p>
		</main>
	);
}
