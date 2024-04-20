export const RespSubject = "resp";
	// the applicant is supposed to respond within 5 days, but leave some wiggle
	// room of a day or two to send the emails after the tokens are generated
export const RespTime = "7d";

export const Buildings = [
	["Test", ""],
	["1830 Alemany", "a0W4U00000KnLRMUA3"],
	["The Canyon", "a0W4U00000IYEb4UAH"],
	["The Fitzgerald", "a0W4U00000IYSM4UAP"],
	["Ventana Residences", "a0W4U00000Ih1V2UAJ"],
	["The George", "a0W4U00000KnCZRUA3"],
];
export const BuildingNumberByName: Record<string, number> = Buildings.reduce((result, [name], i) => ({
	...result,
	[name]: i,
}), {});
export const BuildingIDByNumber: Record<string, string> = Buildings.reduce((result, [_, id], i) => ({
	...result,
	[i]: id,
}), {});
