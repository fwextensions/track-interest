"use client";

import { Buildings } from "@/app/constants";

type Props = {
	value: number;
	onChange: (building: number) => void;
};

export default function BuildingSelector({
	value,
	onChange }: Props)
{
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(Number(event.target.value));
	};

	return (
		<select
			value={value}
			onChange={handleChange}
		>
			{Buildings.map(([name, value], i) => (
				<option
					key={value}
					value={i}
				>
					{i} - {name}
				</option>
			))}
		</select>
	);
}
