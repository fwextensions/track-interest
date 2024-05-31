export type AppIDMap = Record<string, string>;

export type TokenPayload = {
	r: string;
	s: string;
	m: AppIDMap;
};
