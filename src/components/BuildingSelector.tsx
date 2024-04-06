"use client";

import { Buildings } from "@/app/constants";

type Props = {
	value: number;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function BuildingSelector({
	value,
	onChange }: Props)
{
	return (
		<select
			value={value}
			onChange={onChange}
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
