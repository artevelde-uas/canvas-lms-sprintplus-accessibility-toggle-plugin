import styles from './index.module.css';


const states = new WeakMap();


export default class OverlayCutout {

    constructor({
        trackedElement = null,
    } = {}) {
        states.set(this, {
            trackedElement,
            isConnected: false,
            previousBounds: null,
        });
    }

    render() {
        const state = states.get(this);

        // Create an overlay element to cover the entire viewport
        const cutout = document.createElement('span');

        cutout.classList.add(styles.cutout);

        // Update the position and size of the overlay cutout
        function updateOverlayPosition() {
            // If the cutout element is no longer connected to the DOM, stop updating its position
            if (!cutout.isConnected) return;

            // Get the current bounding rectangle of the tracked element
            const nextBounds = state.trackedElement.getBoundingClientRect();

            // If any of the bounds of the tracked element have changed, update the position and size of the overlay cutout
            if (state.previousBounds === null
                || nextBounds.top !== state.previousBounds.top
                || nextBounds.left !== state.previousBounds.left
                || nextBounds.width !== state.previousBounds.width
                || nextBounds.height !== state.previousBounds.height) {
                cutout.style.top = `${nextBounds.top}px`;
                cutout.style.left = `${nextBounds.left}px`;
                cutout.style.width = `${nextBounds.width}px`;
                cutout.style.height = `${nextBounds.height}px`;

                state.previousBounds = nextBounds;
            }

            // Schedule the next update of the overlay position, ensuring smooth updates without blocking the main thread
            requestAnimationFrame(updateOverlayPosition);
        }

        // Monitor the DOM for changes and detect when the cutout element is added or removed
        new MutationObserver((records, observer) => {
            // Start updating the overlay position when the cutout element is added to the DOM
            if (!state.isConnected && cutout.isConnected) {
                state.isConnected = true;
                state.previousBounds = null;

                updateOverlayPosition();
            }

            // Stop updating the overlay position when the cutout element is removed from the DOM
            if (state.isConnected && !cutout.isConnected) {
                state.isConnected = false;

                observer.disconnect();
            }
        }).observe(document.body, {
            childList: true,
            subtree: true
        });

        return cutout;
    }
}
