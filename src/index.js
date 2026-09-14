import { dom } from '@artevelde-uas/canvas-lms-app';
import pTimeout, { TimeoutError } from 'p-timeout';

import t from './i18n';
import ToggleSwitch from './components/ToggleSwitch';
import OverlayCutout from './components/OverlayCutout';
import Modal from './components/Modal';

import toggleSwitchStyles from './components/ToggleSwitch/index.module.css';


function isWebsprinterScriptEmbedded() {
    // Check if the SprintPlus Websprinter script is already loaded by looking for the script tag in the document head
    const existingScript = document.querySelector(`script[src*="websprinterembedded"]`);

    // Return true if the script is already present, false otherwise
    return (existingScript !== null);
}

function embedWebsprinterScript(version = 'latest') {
    // Determine the URL of the SprintPlus Websprinter script based on the specified version
    const url = (version === 'test')
        ? 'https://js.jabbla.com/websprinterembedded/app.js'
        : `https://sprintplus.online/websprinterembedded/${version}/app.js`;

    // Create a script tag for the SprintPlus Websprinter script
    const script = document.createElement('script');
    script.type = 'module';
    script.crossOrigin = '';
    script.src = url;

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

async function showTutorial() {
    // Wait for the navigation tray and profile link elements to be ready in the DOM
    const navTray = await dom.onElementReady('#nav-tray-portal');
    const navProfileLink = await dom.onElementReady('#global_nav_profile_link');

    // Create a promise that resolves when the navigation tray transition ends or after a timeout of 500ms
    const trayTransition = new Promise(resolve => {
        const finish = () => {
            navTray.removeEventListener('transitionend', finish);
            resolve();
        };

        navTray.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, 500);
    });

    // Click the profile link to open the profile tray, which contains the accessibility settings
    navProfileLink.click();

    // Wait for the navigation tray to finish its transition
    await trayTransition;

    // Wait for the Websprinter toggle element to be rendered in the profile tray
    const websprinterToggle = await dom.onElementReady(`span.${toggleSwitchStyles.toggle}`);

    // After a short delay, scroll the Websprinter toggle into view to ensure the user can see it in the profile tray
    setTimeout(() => {
        websprinterToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1000);

    // Create an overlay that covers the entire screen
    const overlay = document.createElement('div');

    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';

    // Add an event listener to the overlay to close it when the user clicks outside of the modal
    overlay.addEventListener('click', event => {
        if (event.target !== overlay) return;

        overlay.remove();
    });

    // Append the overlay to the document body
    document.body.append(overlay);

    // Create an overlay cutout that tracks the position and size of the Websprinter toggle element
    const cutout = new OverlayCutout({ trackedElement: websprinterToggle });

    // Create a modal dialog to provide information about the SprintPlus Websprinter
    const modal = new Modal({
        title: t('tutorial.title'),
        content: t('tutorial.content'),
        onClose: () => {
            // Remove the overlay when the modal is closed
            overlay.remove();
        },
    });

    // Append the overlay cutout and the modal to the overlay to highlight the Websprinter toggle for the user
    overlay.append(
        cutout.render(),
        modal.render()
    );
}

/**
 * Initializes the SprintPlus Websprinter accessibility toggle.
 * 
 * @param {Object} options - Configuration options for the initialization.
 * @param {boolean} [options.defaultVisible=false] - The default visibility state of the Websprinter if not set in localStorage.
 * @param {boolean} [options.initialize=true] - Whether to initialize the Websprinter script embedding.
 * @param {string} [options.websprinterVersion='latest'] - The version of the SprintPlus Websprinter script to load.
 * @param {number} [options.abortAfter=3000] - The maximum time (in milliseconds) to wait for the Jabbla root element to be ready.
 * @returns {Object} An object containing package metadata along with localized title and description.
 */
export default async function ({
    defaultVisible = false,
    initialize = true,
    websprinterVersion = 'latest',
    abortAfter = 3000,
}) {
    // If the visibility state of the SprintPlus Websprinter is not yet set in localStorage, initialize it based on the defaultVisible parameter
    if (localStorage.getItem('websprinter_embedded_fully_hidden') === null) {
        localStorage.setItem('websprinter_embedded_fully_hidden', (!defaultVisible).toString());

        // Display a tutorial to the user about the SprintPlus Websprinter accessibility toggle
        showTutorial();
    }

    // If the script is not loaded and initialization is requested, embed the SprintPlus Websprinter script
    if (initialize && !isWebsprinterScriptEmbedded()) {
        console.log('SprintPlus Websprinter not yet initialized. Embedding script...');

        embedWebsprinterScript(websprinterVersion);
    }

    // Prevent the default behavior of ALT+S key combination to avoid conflicts
    document.addEventListener('keydown', event => {
        if (event.altKey && event.code === 'KeyS') {
            event.preventDefault();
        }
    });

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
