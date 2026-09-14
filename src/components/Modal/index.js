import styles from './index.module.css';


const states = new WeakMap();


export default class Modal {

    constructor({ title, onClose, content } = {}) {
        states.set(this, {
            title,
            onClose,
            content,
        });
    }

    render() {
        const state = states.get(this);

        // Create a template element to hold the toggle switch structure
        const container = document.createElement('template');

        // Set the inner HTML of the template to create the toggle switch structure
        container.innerHTML = `
            <div class="${styles.modal}">
                <div class="${styles.header}">
                    <h1 class="${styles.title}">${state.title}</h1>
                    <button class="${styles.closeButton}" aria-label="Close">⨉</button>
                </div>
                <div class="${styles.content}">
                    ${state.content}
                </div>
            </div>
        `;

        // Store references to the elements in the state for later use
        const modal = container.content.querySelector(`div.${styles.modal}`);
        const closeButton = container.content.querySelector(`button.${styles.closeButton}`);

        // Add event listener for toggle changes
        closeButton.addEventListener('click', async event => {
            // Call the onClose callback if provided
            const result = (typeof state.onClose === 'function') && state.onClose();

            // If the onClose callback returns false, do not close the modal
            if (result === false) return;

            // Remove the modal from the DOM
            modal.remove();
        });

        // Return the content of the template, which contains the toggle switch elements
        return modal;
    }
}
