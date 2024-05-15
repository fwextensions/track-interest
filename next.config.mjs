/** @type {import('next').NextConfig} */
const nextConfig = {
//	reactStrictMode: false,
	async rewrites()
	{
		return [
			{
				source: "/dahlia/:path*",
				destination: `https://housing.sfgov.org/api/v1/:path*`,
			},
		];
	},
	async headers()
	{
		return [
			{
				// matching all API routes
				source: "/dahlia/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
					{ key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
					{
						key: "Access-Control-Allow-Headers",
						value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
					},
				]
			}
		];
	}
};

export default nextConfig;
