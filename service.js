
const puppeteer = require("puppeteer");

module.exports  = (async function(prop){
    
    const props = prop; 
    const browser = await puppeteer.launch({headless: false, defaultViewport: null, args: ['--start-maximized'],channel: 'chrome'});
    const page = await browser.newPage();


    // function to extract token code from token name,e.g. "WBTC" from "Wrapped BTC (WBTC)"
    function getTokenCode(string) {
        return string.slice(
          string.indexOf('(') + 1,
          string.lastIndexOf(')'),
        );
      }

    try{ 
        await page.goto(props.URL);

        // Wait for dropdown in DOM (CHAIN field)
        await page.waitForSelector('.css-1wy0on6');
        await page.click('.css-1wy0on6');
        
        // Selecting the Chain field besed on text
        await page.evaluate((CHAIN) => {
            const container = document.querySelector('#react-select-2-listbox');
            const elements = [...container.querySelectorAll('div')];
            
            const targetElement = elements.find(e => e.innerHTML == CHAIN);
            if (targetElement) 
            targetElement.click();
        
        },props.CHAIN);



        // Entering the Quantity 
        await page.click(".chakra-input.css-lv0ed5",{ clickCount: 3 })
        await page.type(".chakra-input.css-lv0ed5",props.S_QTY);



        // Entering the sell token 
        
        await page.waitForSelector('.chakra-button.css-qjhap');
        await page.click('.chakra-button.css-qjhap');
        await page.keyboard.type(getTokenCode(props.S_TOKEN)); // searching for token using text input field
        
        await page.waitForFunction(
            (TOKEN_CODE) => {
              return document.querySelector('section').innerText.includes(TOKEN_CODE); // waiting for token code to be loaded on DOM
            },{},getTokenCode(props.S_TOKEN)
          );
        await page.evaluate((S_TOKEN) => {
            const elements = [...document.querySelectorAll('.chakra-text.css-72rvq0')];
            const targetElement = elements.find(e => e.innerText == S_TOKEN); // Iterating over all list elements and selecting the desired token
            if (targetElement) targetElement.click();
        },props.S_TOKEN);
        


        // To settle down the DOM after Sell field token selection and make sure sell field contains desired selection
        
        await page.waitForSelector('.chakra-button.css-qjhap');
        await page.waitForFunction(
            (TOKEN_CODE) => {
              return document.querySelector('.chakra-button.css-qjhap').innerText.includes(TOKEN_CODE);
            },{},getTokenCode(props.S_TOKEN)
          );



        // Entering the Buy token

        await page.evaluate(()=>{
            const values = document.querySelectorAll('.chakra-button.css-qjhap');
            values[1].click();
        })
        await page.keyboard.type(getTokenCode(props.B_TOKEN)); // searching for token using text input field
        await page.waitForFunction(
            (TOKEN_CODE) => {
              return document.querySelector('section').innerText.includes(TOKEN_CODE); // waiting for token code to be loaded on DOM
            },{},getTokenCode(props.B_TOKEN)
          );
        await page.evaluate((B_TOKEN) => {
            const elements = [...document.querySelectorAll('.chakra-text.css-72rvq0')]; // Iterating over all list elements and selecting the desired token
            const targetElement = elements.find(e => e.innerText == B_TOKEN);
            if (targetElement) targetElement.click();
        },props.B_TOKEN);
        



        // Selecting the swap route
        // INDEX = 2 
        await page.waitForFunction(
        (INDEX) => {
        const elements = document.getElementsByClassName('RouteWrapper'); // wait until INDEX'th route loads
        return elements.length == INDEX;
        },{},props.INDEX);

        await page.waitForSelector('.sc-18d0abec-0.knYyMy:not(.RouteWrapper)',{hidden:true,timeout:50000}) // Wait until all rest routes are loaded after INDEX'th route
        //comment the above line if want to select INDEX'th element without waiting for others to load;
        
        await page.evaluate((INDEX) => {
            const elements = [...document.querySelectorAll('.RouteWrapper')]; // select the INDEX'th route
            elements[INDEX-1].click();
        },props.INDEX);
    }


    // Catch errors and close the browser
    catch (err) { console.log(err); browser.close()};



})
