import { dom } from '@artevelde-uas/canvas-lms-app';
import pTimeout, { TimeoutError } from 'p-timeout';

import t from './i18n';
import ToggleSwitch from './components/ToggleSwitch';


const WEBSPRINTER_URL = 'https://sprintplus.online/websprinterembedded/latest/app.js';


function isWebsprinterScriptEmbedded() {
    // Check if the SprintPlus Websprinter script is already loaded by looking for the script tag in the document head
    const existingScript = document.querySelector(`script[src*="websprinterembedded"]`);

    // Return true if the script is already present, false otherwise
    return (existingScript !== null);
}

function embedWebsprinterScript() {
    // Create a script tag for the SprintPlus Websprinter script
    const script = document.createElement('script');
    script.type = 'module';
    script.crossOrigin = '';
    script.src = WEBSPRINTER_URL;

    // Add the script to the document head
    document.head.appendChild(script);
}

function isWebsprinterVisible() {
    // Check the visibility state of the SprintPlus Websprinter from localStorage
    return localStorage.getItem('websprinter_embedded_fully_hidden') !== 'true';
}

function setWebsprinterVisibility(value) {
    // If the desired visibility state is already set, do nothing
    if (value === isWebsprinterVisible()) {
        return;
    }

    // Dispatch a synthetic keydown event for ALT+S to toggle the visibility of the WebSprinter
    document.body.dispatchEvent(new KeyboardEvent('keydown', {
        key: 's',
        code: 'KeyS',
        altKey: true,
        bubbles: true,
        cancelable: true
    }));
}


/**
 * Initializes the SprintPlus Websprinter accessibility toggle.
 * 
 * @param {Object} options - Configuration options for the initialization.
 * @param {boolean} [options.defaultVisible=false] - The default visibility state of the Websprinter if not set in localStorage.
 * @param {boolean} [options.initialize=true] - Whether to initialize the Websprinter script embedding.
 * @param {number} [options.abortAfter=3000] - The maximum time (in milliseconds) to wait for the Jabbla root element to be ready.
 * @returns {Object} An object containing package metadata along with localized title and description.
 */
export default async function ({
    defaultVisible = false,
    initialize = true,
    abortAfter = 3000,
}) {
    // If the visibility state of the SprintPlus Websprinter is not yet set in localStorage, initialize it based on the defaultVisible parameter
    if (localStorage.getItem('websprinter_embedded_fully_hidden') === null) {
        localStorage.setItem('websprinter_embedded_fully_hidden', (!defaultVisible).toString());
    }

    // If the script is not loaded and initialization is requested, embed the SprintPlus Websprinter script
    if (initialize && !isWebsprinterScriptEmbedded()) {
        console.log('Initializing SprintPlus Websprinter script embedding...');

        embedWebsprinterScript();
    }

    // Wait up to three seconds for the Jabbla root element to be ready in the DOM
    pTimeout(
        dom.onElementReady('#jabbla-root'),
        abortAfter
    ).then(async (jabblaRootElement) => {
        // Create a new instance of the ToggleSwitch component for controlling the visibility of the SprintPlus Websprinter
        const websprinterToggle = new ToggleSwitch({
            label: t('toggleLabel'),
            defaultChecked: isWebsprinterVisible(),
            onChange: setWebsprinterVisibility,
        });

        // Listen for the addition of the profile tray element in the DOM, which contains the user's accessibility settings
        dom.onElementAdded('.profile-tray', async (profileTray) => {
            // Wait for the dyslexic font toggle element to be ready inside the profile tray
            const dyslexicFontToggle = await dom.onElementReady('[data-testid="dyslexic-font-toggle"]', { root: profileTray });

            // Render the Websprinter toggle switch and insert it into the DOM right after the dyslexic font toggle
            const websprinterToggleElement = websprinterToggle.render();

            // Add the Websprinter toggle right after the dyslexic font toggle
            dyslexicFontToggle.parentElement.insertBefore(websprinterToggleElement, dyslexicFontToggle.nextSibling);
        });

        // Wait for the show button element to be ready in the DOM, using the Jabbla root element as the root for the query
        dom.onElementReady('[class*="showButton"]', { root: jabblaRootElement }).then(showButtonElement => {
            // Listen for changes to the show button's aria-hidden attribute, which indicates whether the Websprinter is currently visible or hidden
            dom.onAttributeChange(showButtonElement, value => {
                // Update the Websprinter toggle's checked state based on the visibility of the Websprinter
                websprinterToggle.checked = (value !== 'true');
            }, { filter: ['aria-hidden'] });
        });

    }).catch(error => {
        if (error instanceof TimeoutError) {
            console.error(`Error waiting for Jabbla root element: ${error.message}`);
        } else {
            console.error(error);
        }
    });

    // Return package metadata along with localized title and description
    return {
        ...require('../package.json'),
        title: t('package.title'),
        description: t('package.description')
    };
}
