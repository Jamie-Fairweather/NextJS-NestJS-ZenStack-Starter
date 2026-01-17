/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui', '@workspace/database', '@workspace/contracts'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hel1.your-objectstorage.com',
            },
        ],
    },
    output: 'standalone',
}

export default nextConfig
