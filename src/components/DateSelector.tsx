type Props = {
	defaultValue: string;
	onChange: (date: string) => void;
};

export default function DateSelector({
	defaultValue,
	onChange }: Props)
{
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	return (
		<>
			<h3>Select a send date:</h3>
			<input type="date"
				defaultValue={defaultValue}
				onBlur={handleChange}
			/>
		</>
	);
}
