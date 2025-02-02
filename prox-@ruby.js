const fs = require('fs');
const axios = require('axios');
const path = require('path');

const PROXY_SOURCES = [
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks4.txt'
];
const PROXY_FILE = path.join(__dirname, 'proxies.txt');
const UPDATE_INTERVAL = 12 * 60 * 60 * 1000;

async function fetchProxies() {
    try {
        console.log('[INFO] Fetching proxies...');
        let allProxies = [];

        for (const url of PROXY_SOURCES) {
            const response = await axios.get(url);
            const proxies = response.data.split('\n').map(line => line.trim()).filter(line => line);
            allProxies.push(...proxies);
        }

        const formattedProxies = allProxies.map(proxy => `http://@${proxy}`);
        
        fs.writeFileSync(PROXY_FILE, formattedProxies.join('\n'));
        console.log(`[SUCCESS] Saved ${formattedProxies.length} proxies to ${PROXY_FILE}`);
    } catch (error) {
        console.error('[ERROR] Failed to fetch proxies:', error.message);
    }
}

fetchProxies();

setInterval(fetchProxies, UPDATE_INTERVAL);
