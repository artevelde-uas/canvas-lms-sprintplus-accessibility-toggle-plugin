try {
    console.log('Setting up Sprint+ configuration...');

    // Als je de websprinter niet standaard wilt zien:
    // shortcut ALT+S
    // const isHidden = localStorage.getItem('websprinter_embedded_fully_hidden');

    // if (isHidden === null) {
    //     localStorage.setItem('websprinter_embedded_fully_hidden', true);
    // }

    // // Voorkomt dat Alt-S de standaard browser functionaliteit triggert

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 's') {
            console.log('ALT+S pressed');
            // console.log(event);

            const isHidden = localStorage.getItem('websprinter_embedded_fully_hidden');

            console.log('Current SprintPlus visibility state:', isHidden);

            event.preventDefault();
        }
    });

    // document.addEventListener('keydown', (event) => {
    //     if (event.altKey && event.key === 'w') {
    //         console.log('ALT+W pressed');
    //         // console.log(event);

    //         event.preventDefault();

    //         document.body.dispatchEvent(new KeyboardEvent('keydown', {
    //             key: 's',
    //             code: 'KeyS',
    //             altKey: true,
    //             bubbles: true,
    //             cancelable: true
    //         }));
    //     }
    // });

    // Controleer of het script al is geladen
    if (!window.__websprinter_loaded) {
        window.__websprinter_loaded = true;

        // Maak een script tag aan
        const script = document.createElement('script');
        script.type = 'module';
        script.crossOrigin = '';
        script.src = 'https://sprintplus.online/websprinterembedded/latest/app.js';

        document.head.appendChild(script);

        // Verplaats het Jabbla-rootelement naar de voorgrond
        // const style = document.createElement('style');
        // style.textContent = `
        //     #jabbla-root {
        //             position: relative;
        //             z-index: 100;
        //         }
        //     `;

        // document.head.appendChild(style);

        console.log('Sprint+ global JS loaded');
    }
} catch (error) {
    console.error('Error loading WebSprinter:', error);
}
