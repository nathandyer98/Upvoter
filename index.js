const puppeteer = require('puppeteer');
const { SERVER_ID, SERVER_NAME, COOKIE } = require('./config.json');
const logger = require('./logger.js');

if (!SERVER_ID) return logger.err('Config SERVER_ID is missing');
if (!SERVER_NAME) return logger.err('Config SERVER_NAME is missing');
if (!COOKIE) return logger.err('Config COOKIE is missing');

async function vote() {
	logger.try(`Trying to vote for ${SERVER_NAME}...`);

	const browser = await puppeteer.launch({ headless: false, args: ['--window-size=0,300'] });
	const page = (await browser.pages())[0];

	await page.setCookie({ name: 'connect.sid', value: COOKIE, domain: 'top.gg', path: '/' });
	await page.goto(`https://top.gg/servers/${SERVER_ID}/vote`);

	await new Promise((resolve)=>setTimeout(() => {
		page.click('#votingvoted');
        resolve();
	}, 10000));

	await new Promise((resolve)=>setTimeout(() => {
		logger.succ(`Successfully voted for ${SERVER_NAME}!`);
		browser.close()
		logger.info('Waiting 12 hours');
        resolve();
	}, 2000));
}
vote();

setInterval(() => {
	vote();
}, 1000 * 60 * 60 * 12);
