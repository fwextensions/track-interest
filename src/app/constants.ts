export const RespSubject = "resp";
	// the applicant is supposed to respond within 5 days, but leave some wiggle
	// room of a day or two to send the emails after the tokens are generated
export const RespTime = "7d";
	// the sent date starts at the beginning of the day, but we won't send the
	// email until sometime later that day, and we want to give the recipient 5
	// whole days to respond.  adding 6 days wraps to midnight on the next day,
	// which is too much.  so add 1 hour to get to the beginning of the 6th day.
export const DueDateOffset = { days: 5, hours: 1 };
	// make the token expiration date 6 full days from the sent date, just before
	// midnight, to give the applicant some wiggle room
export const ExpDateOffset = { days: 6, hours: 23, minutes: 59 };

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
