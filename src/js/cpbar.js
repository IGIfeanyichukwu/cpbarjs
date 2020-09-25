
/*

 +--------------------------------------------------------+
 | CPBAR.JS - The library for circular progress bar       |
 | developed to seamlessly create circular progress bars  |
 +--------------------------------------------------------+
 
 Developed by I.G Ifeanyichukwu (Ifex). All rights reserved.
 
 */

/*calculate the exact svg stroke offset based on a given maximum value */
const calculateStrokeDashOffset = (val, maxVal) => {
    let pV, pMV;
    pV = Number(parseFloat(val).toFixed(1));
    pMV = Number(parseFloat(maxVal).toFixed(1));
    if(pV >= 0 && pV <= pMV) {
        return 817 - ((pV/pMV) * 817);
    } else if(pV < 0){
        return 817;
    } else {
        return 0;
    }
}

/* calculate the exact value for the center text */
const calculateRealValue = (val, maxVal) => {
    if(Number(parseFloat(val).toFixed(1)) >= 0 && Number(parseFloat(val).toFixed(1)) <= Number(parseFloat(maxVal).toFixed(1))) {
        return Number(parseFloat(val).toFixed(1));
    } else if(Number(parseFloat(val).toFixed(1)) < 0) {
        return 0;
    } else {
        return Number(parseFloat(maxVal).toFixed(1));
    }
}

/* create a cool error logger */
const logError = (err) => {
    let errStyles = [
        'background: red',
        'border: 1px solid black',
        'color: white',
        'display: block',
        'font-weight: bold',
        'font-size: 14px',
        'text-align: center'
    ].join(';');
    console.log( `%c Cpbar.js Error😭: ${err}`, errStyles) 
}


/* Compute and return the stops for gradient */
const computeGradient = (stops) => {
    
    let outputStop = '';
    
    stops.forEach(function(stop) {
        outputStop += `<stop offset="${stop[1]}%" stop-color="${stop[0]}" /> `;
    })
    
    return outputStop;
}


/* paint the DOM with circular progress bar using the given preference */
const draw = function draw(preferences) { 
    
    //check if the argument given is undefined
    if(preferences == undefined) {
        logError('Pls, pass an object of preferences to draw().')
    } else {
    
        
        //a function to get most preferred preference
    const getPreference = (preference) => {
        
   /* set fall-back or default preferences incase not given by user  */
        let defaultPreferences = {
            elementClass: null,
            barSize: 200, //max is 1000
            barBgColor: 'grey',
            barBgColorOpacity: '0',
            setText: 'CBP',
            useText: false,
            value: 0,
            valueUnit: '%',
            valueColor: 'black',
            valueFont: 'monospace',
            valueFontSize: '60',
            valueOpacity: '1',
            maxValue: 100,
            indicatorSize: '15',
            indicatorColor: 'black',
            indicatorCap: 'acute-square',
            trackSize: 15,
            trackColor: '#eee',
            setGradient: [ ['rgba(0, 0, 0, 1)', 0], ['rgba(0, 0, 0, 0.5)', 50], ['rgba(0, 0, 0, 0.2)', 100] ]
        }

        if (preferences[preference] == undefined) {
            return defaultPreferences[preference];
        } else {
            return preferences[preference];
        }    
    }
    
 
    try {
        /* fetch element base on given class */
    const fetchedElement = document.querySelector(`.${getPreference('elementClass')}`);
    
    if(fetchedElement == null) { /* throw an error if no element is found */
        throw 'Could not find any DOM element, pls check the given elementClass and argument passed to draw().';
    } else {
    
        /* render the circular progress bar to the fetched element */
        fetchedElement.innerHTML = `
                <svg width="${getPreference('barSize') <= 1000 ? getPreference('barSize') : 200}" height="${getPreference('barSize') <= 1000 ? getPreference('barSize') : 200}" viewBox="0 0 300 300">
                    <defs>
                        <linearGradient id="CPB-${getPreference('elementClass')}-Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            ${computeGradient(getPreference('setGradient'))}
                        </linearGradient>
                    </defs>

                    <circle class="${getPreference('elementClass')}-track" cx="150" cy="150" r="130"  />
                    <circle class="${getPreference('elementClass')}-indicator" cx="150" cy="150" r="130" transform="rotate(-90 150 150)" stroke-dashoffset="1" stroke-dasharray="1" />
                    <text class="${getPreference('elementClass')}-text" stroke-width="0" x="150" y="58%" text-anchor="middle">${getPreference('useText') === true ? getPreference('setText') : calculateRealValue(getPreference('value'), getPreference('maxValue'))+''+getPreference('valueUnit')}</text>
                </svg>
    `;

        /* select the track, indicator and insideText from the rendered to fetched element */
        const track = document.querySelector(`.${getPreference('elementClass')}-track`);
        const indicator = document.querySelector(`.${getPreference('elementClass')}-indicator`);
        const insideText = document.querySelector(`.${getPreference('elementClass')}-text`);



        /* WORKING ON THE INDICATOR */
        indicator.style.strokeDasharray = '817';
        indicator.style.strokeDashoffset = `${calculateStrokeDashOffset(getPreference('value'), getPreference('maxValue'))}`;
    //    indicator.style.fill = "red";
        indicator.style.stroke = `${getPreference('indicatorColor') ==='useGradient' ? `url(#CPB-${getPreference('elementClass')}-Gradient)` : getPreference('indicatorColor')}`;
        indicator.style.strokeWidth = `${getPreference('indicatorSize') > 40 || getPreference('indicatorSize') < 0 ? 15 : getPreference('indicatorSize')}`; /* max value is 40 */
        indicator.style.strokeLinecap = `${getPreference('indicatorCap') === 'acute-square' ? 'butt' : getPreference('indicatorCap')}`;/*other val => square, butt, round*/
        indicator.style.fillOpacity = "0";



        /* WORKING ON THE TRACK */
        track.style.stroke = `${getPreference('trackColor') ==='useGradient' ? `url(#CPB-${getPreference('elementClass')}-Gradient)` : getPreference('trackColor')}`;
        track.style.strokeWidth = `${getPreference('trackSize') > 40 || getPreference('trackSize') < 0 ? 15 : getPreference('trackSize')}`; /* max value => 40 */
        track.style.fill = `${getPreference('barBgColor') ==='useGradient' ? `url(#CPB-${getPreference('elementClass')}-Gradient)` : getPreference('barBgColor')}`;
        track.style.fillOpacity = `${getPreference('barBgColorOpacity')}`;


        /* WORKING ON THE INSIDETEXT */
        insideText.style.fontSize = `${getPreference('valueFontSize') < 10 ? 10 : getPreference('valueFontSize') > 100 ? 100 : getPreference('valueFontSize')}px`; /* default is 60px */
        insideText.style.fill = `${getPreference('valueColor') ==='useGradient' ? `url(#CPB-${getPreference('elementClass')}-Gradient)` : getPreference('valueColor')}`;
        insideText.style.fontWeight = "600"; 
        insideText.style.fillOpacity = `${getPreference('valueOpacity')}`;
        insideText.style.fontFamily = `${getPreference('valueFont')}`;
        
    }
        
} catch (e) {
    logError(e);
}  
    
 }
    
}

export { draw };

/* >>>>>>>>>>>>CODED WITH LOVE - IFEX<<<<<<<<<<<<<<<<< */