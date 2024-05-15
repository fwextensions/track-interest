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

};

export default nextConfig;
